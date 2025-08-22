import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FlashCardGenerateDTO, RawDataUploadDTO } from './dto/flashcard.dto';
import { Sequelize } from 'sequelize-typescript';
import FlashCardRawData from 'src/models/flashcard-raw-data.model';
import FlashCard from 'src/models/flashcard.model';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { FLASHCARD_SLIDE_TYPE } from 'src/utils/flashcard-slide-type.enum';
import FlashCardSlide from 'src/models/flashcard-slide.model';

@Injectable()
export class FlashcardService {
  constructor(private sequelize: Sequelize) {}
  async generateFlashCard(
    flashCardGenerateDTO: FlashCardGenerateDTO,
    req: any,
    outsideTransaction: any,
  ) {
    console.log("came in flashcard generate")
    let transaction: any = outsideTransaction;
    if (!outsideTransaction) {
      transaction = await this.sequelize.transaction();
    }

    const { temporary_flashcard_id, workspace_id } = flashCardGenerateDTO;

    const generated = [
      {
        type: FLASHCARD_SLIDE_TYPE.CONCISE,
        slides: [
          {
            title: 'This is title',
            text: '',
          },
          {
            title: '',
            text: 'this is text for next slide',
          },
        ],
      },
      {
        type: FLASHCARD_SLIDE_TYPE.STANDARD,
        slides: [
          {
            title: 'This is title',
            text: 'this is the text of give slide',
          },
          {
            title: 'this is the title',
            text: 'this is text for next slide',
          },
        ],
      },
      {
        type: FLASHCARD_SLIDE_TYPE.DETAILED,
        slides: [
          {
            title: 'This is title',
            text: 'this is the text of give slide, this is anoterh more text',
          },
          {
            title: 'this is the title',
            text: 'this is text for next slide, this is another more text',
          },
        ],
      },
    ]; // @fix implement openai here

    try {
      const flashCard = await FlashCard.findOne({
        where: {
          [Op.and]: [
            {
              temporary_flashcard_id: {
                [Op.eq]: temporary_flashcard_id,
              },
            },
            {
              temporary_flashcard_id: {
                [Op.ne]: null,
              },
            },
            {
              user_id: {
                [Op.eq]: null,
              },
            },
            {
              workspace_id: {
                [Op.eq]: null,
              },
            },
          ],
        },
        transaction
      });

      if (!flashCard) {
        if (!outsideTransaction) {
          await transaction.rollback();
        }
        throw new HttpException(
          'no flashcard found - error generating',
          HttpStatus.BAD_REQUEST,
        );
      }

      // @fix attach slides of flashcard, generate model for that

      await flashCard.update(
        {
          temporary_flashcard_id: null,
          user_id: req.user.id,
          workspace_id: workspace_id,
        },
        {
          transaction,
        },
      );

      await FlashCardSlide.bulkCreate(
        generated[0].slides.map((d) => ({
          slide_type: generated[0].type,
          title: d.title,
          text: d.text,
          flashcard_id: flashCard.id,
        })),
        {
          transaction,
          validate: true, // runs model validations on each record
          ignoreDuplicates: true, // optional, skips inserts that violate unique constraints
          returning: true, // returns the created records (esp. useful in Postgres)
        },
      );

      await FlashCardSlide.bulkCreate(
        generated[1].slides.map((d) => ({
          slide_type: generated[1].type,
          title: d.title,
          text: d.text,
          flashcard_id: flashCard.id,
        })),
        {
          transaction,
          validate: true, // runs model validations on each record
          ignoreDuplicates: true, // optional, skips inserts that violate unique constraints
          returning: true, // returns the created records (esp. useful in Postgres)
        },
      );

      await FlashCardSlide.bulkCreate(
        generated[2].slides.map((d) => ({
          slide_type: generated[2].type,
          title: d.title,
          text: d.text,
          flashcard_id: flashCard.id,
        })),
        {
          transaction,
          validate: true, // runs model validations on each record
          ignoreDuplicates: true, // optional, skips inserts that violate unique constraints
          returning: true, // returns the created records (esp. useful in Postgres)
        },
      );

      if (!outsideTransaction) {
        await transaction.commit();
      }
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'flash card created successfully',
          flash_card: flashCard,
        },
      };
    } catch (error) {
      console.log(
        'lola in flashacar service geenrate flash ard ========',
        error,
      );
      if (!outsideTransaction) {
        await transaction.rollback();
      }
      throw new HttpException('Error: ', +error.message, error.status);
    }
  }

  async uploadRawData(rawDataUploadDTO: RawDataUploadDTO, req: any) {
    const transaction = await this.sequelize.transaction();
    const { text, data_type } = rawDataUploadDTO;

    try {
      const temp_id = uuidv4();
      const flashCard = await FlashCard.create(
        {
          temporary_flashcard_id: temp_id, // @fix generate temp id
          user_id: null,
          workspace_id: null,
        },
        {
          transaction,
        },
      );
      if (!flashCard) {
        await transaction.rollback();
        throw new HttpException(
          'Error while processing flashcard',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await FlashCardRawData.create(
        {
          text,
          data_type,
          flashcard_id: flashCard.id,
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'upload successfull',
          temporary_flashcard_id: flashCard.temporary_flashcard_id,
        },
      };
    } catch (error) {
      console.log('error', error.message);
      await transaction.rollback();
      throw new HttpException('Error ' + error.message, error.status);
    }
  }
}
