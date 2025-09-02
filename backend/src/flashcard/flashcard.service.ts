import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FlashCardGenerateDTO, RawDataUploadDTO } from './dto/flashcard.dto';
import { Sequelize } from 'sequelize-typescript';
import FlashCardRawData from 'src/models/flashcard-raw-data.model';
import FlashCard from 'src/models/flashcard.model';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { FLASHCARD_SLIDE_TYPE } from 'src/utils/flashcard-slide-type.enum';
import FlashCardSlide from 'src/models/flashcard-slide.model';
import { extractJsonBlock, generateFlashcardSlides } from 'src/utils/openai-flashCard.utils';

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
    const flashCard=await FlashCard.findOne(
       {where:
         {
              temporary_flashcard_id: {
                [Op.eq]: temporary_flashcard_id,
              },
          },
           include:[
        {
          model:FlashCardRawData,
          as:'raw_data'
        }
      ]
        }
    )

     const generatedSlides = await generateFlashcardSlides(flashCard.dataValues.raw_data.dataValues.text);
    console.log("generatedSlides",typeof generatedSlides)
     const extractedJson = extractJsonBlock(generatedSlides);

     if (!extractedJson) {
       throw new Error('No valid JSON found in OpenAI response');
     }
     let parsedSlides
     try {
      
      parsedSlides = JSON.parse(extractedJson);
    } catch (error) {
      console.log("======",error.message)
      throw new Error(error)
    }
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
      console.log("parse",typeof parsedSlides)
      if (!parsedSlides || typeof parsedSlides !== 'object') {
        throw new Error('Invalid parsedSlides data');
      }
      await this.storeParsedSlides(parsedSlides,flashCard.id);

     

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
        ' in flashacar service geenrate flash ard ========',
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
    const { text,title, data_type } = rawDataUploadDTO;

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
          title,
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

  async getFlashCardById(id:number, req: any) {
   
    try {

      const flashCard = await FlashCard.findOne({
        where: {
          id: id,
        },
        include:[{
          model:FlashCardSlide,
          as:'slides',
        },
        {
          model:FlashCardRawData,
          as:'raw_data'
        }
      ]
      });
      if(!flashCard){
        throw new HttpException('Flash card not found', HttpStatus.NOT_FOUND);
      }
      return flashCard;
    } catch (error) {
      console.log('error', error.message);
     
      throw new HttpException('Error ' + error.message, error.status);
    }
  }

  async storeParsedSlides  (parsedSlides: Record<string, any[]>,flashcardId:number) {
    const slidesToInsert = Object.entries(parsedSlides).flatMap(([key, slides]) => {
      const upperKey = key.toUpperCase().trim();
    
      if (!(upperKey in FLASHCARD_SLIDE_TYPE)) {
        console.warn(`⚠️ Skipping unknown slide type: ${key}`);
        return [];
      }
    
      const slideType = FLASHCARD_SLIDE_TYPE[upperKey as keyof typeof FLASHCARD_SLIDE_TYPE];
    
      if (!slideType) {
        console.warn(`Skipping unknown slide type: ${key}`);
        return [];
      }
  
      return slides.map(slide => ({
        slide_type: slideType,
        title: slide.title || '',
        text: slide.text || '',
        flashcard_id: flashcardId,
      }));
    });
  
    try {
      await FlashCardSlide.bulkCreate(slidesToInsert);
      console.log('✅ Slides stored successfully!');
    } catch (error) {
      console.error('❌ Error saving slides:', error);
    }
  };
}
