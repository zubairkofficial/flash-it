import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  FlashCardGenerateDTO,
  RawDataUploadDTO,
  UploadPdfGenerateDTO,
} from './dto/flashcard.dto';
import { Sequelize } from 'sequelize-typescript';
import FlashCardRawData from 'src/models/flashcard-raw-data.model';
import FlashCard from 'src/models/flashcard.model';
import { v4 as uuidv4 } from 'uuid';
import { FLASHCARD_SLIDE_TYPE } from 'src/utils/flashcard-slide-type.enum';
import FlashCardSlide from 'src/models/flashcard-slide.model';
import {
  extractJsonBlock,
  generateFlashcardSlides,
} from 'src/utils/openai-flashCard.utils';
import { PdfService } from 'src/utils/pdf';
import { SubscriptionPlan } from 'src/models/subscription-plan.model';
import User from 'src/models/user.model';
import WorkSpace from 'src/models/workspace.model';
import { SUBSCRIPTION_TYPE } from 'src/utils/subscription.enum';
import { DATA_TYPE } from 'src/utils/data-type.enum';
import { th } from 'zod/v4/locales';

@Injectable()
export class FlashcardService {
  constructor(
    private sequelize: Sequelize,
    private pdfService: PdfService,
  ) {}

  // Regenerate flashcard by id
  async regenerateFlashcard(flashcardId: number, req: any) {
    const transaction = await this.sequelize.transaction();
    try {
      // Fetch flashcard details by id
      const flashCard = await FlashCard.findOne({
        where: { id: flashcardId },
        include: [
          {
            model: FlashCardRawData,
            as: 'raw_data',
            attributes: ['text', 'language'],
          },
        ],
        transaction,
      });
      if (!flashCard?.raw_data?.length) {
        await transaction.rollback();
        throw new HttpException(
          'No flashcard or raw data found.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Delete previous slides
      await FlashCardSlide.destroy({
        where: { flashcard_id: flashcardId },
        transaction,
      });

      // Get workspace info
      let workspaceId = flashCard.workspace_id;
      let userId = req.user.id;
      if (!workspaceId) {
        const workspace = await WorkSpace.findOne({
          where: { admin_user_id: userId },
          attributes: ['id'],
        });
        if (!workspace) {
          await transaction.rollback();
          throw new HttpException('Workspace not found.', HttpStatus.NOT_FOUND);
        }
        workspaceId = workspace.id;
      }
      // Get user plan
      const user = await User.findByPk(userId, { attributes: ['plan_id'] });
      if (!user) {
        await transaction.rollback();
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const userPlan = await SubscriptionPlan.findByPk(user.plan_id, {
        attributes: ['plan_type'],
      });
      if (!userPlan) {
        await transaction.rollback();
        throw new HttpException(
          'Subscription plan not found',
          HttpStatus.NOT_FOUND,
        );
      }
      // Combine raw data text
      const combinedText = flashCard.raw_data.map((r) => r.text).join('\n\n');
      const language = flashCard.raw_data[0].language;
      // Generate slides
      const generatedSlides = await generateFlashcardSlides(
        combinedText,
        language,
        userPlan.plan_type,
      );
      let extractedJson;
      if (typeof generatedSlides === 'object') {
        extractedJson = generatedSlides;
      } else {
        const rawJson = extractJsonBlock(generatedSlides);
        if (!rawJson) throw new Error('No valid JSON found in OpenAI response');
        extractedJson = JSON.parse(rawJson);
      }
      if (!extractedJson || typeof extractedJson !== 'object') {
        throw new Error('Invalid parsedSlides data');
      }
      await this.storeParsedSlides(extractedJson, flashCard.id, transaction);
      await transaction.commit();
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Flashcard regenerated successfully',
          flash_card: flashCard,
        },
      };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(
        'Error: ' + error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete raw data from a flashcard
  async deleteRawDataFromFlashcard(
    flashcardId: number,
    rawDataId: number,
    req: any,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const rawData = await FlashCardRawData.findOne({
        where: { id: rawDataId, flashcard_id: flashcardId },
      });
      if (!rawData) {
        await transaction.rollback();
        throw new HttpException('Raw data not found', HttpStatus.NOT_FOUND);
      }
      await rawData.destroy({ transaction });
      await transaction.commit();
      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Raw data deleted successfully',
      };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(
        'Error ' + error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get raw data for a flashcard
  async getRawDataByFlashcardId(flashcardId: number, req: any) {
    try {
      const rawData = await FlashCardRawData.findAll({
        where: { flashcard_id: flashcardId },
      });
      return {
        status: HttpStatus.OK,
        success: true,
        data: rawData,
      };
    } catch (error) {
      throw new HttpException(
        'Error ' + error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Add raw data to a flashcard
  async addRawDataToFlashcard(
    flashcardId: number,
    files: Express.Multer.File[],
    rawDataUploadDTO: RawDataUploadDTO,
    req: any,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      let rawData;
      // If text is present and not empty, use text and skip file processing
      if (rawDataUploadDTO.text && rawDataUploadDTO.text.trim().length > 0) {
        rawData = await FlashCardRawData.create(
          {
            text: rawDataUploadDTO.text,
            title: rawDataUploadDTO.title || '',
            data_type: DATA_TYPE.TEXT,
            flashcard_id: flashcardId,
            language: rawDataUploadDTO.language,
          },
          { transaction },
        );
      } else if (files && files.length > 0) {
        // Otherwise, process files
        for (const file of files) {
          const data = await this.pdfService.extractTextFromBuffer(file.buffer);
          rawData = await FlashCardRawData.create(
            {
              text: data.text,
              title: data.title || '',
              data_type: data.data_type,
              file_size: data.file_size,
              flashcard_id: flashcardId,
              language: rawDataUploadDTO.language,
            },
            { transaction },
          );
        }
      } else {
        await transaction.rollback();
        throw new HttpException(
          'No files or text provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      await transaction.commit();
      return {
        status: HttpStatus.OK,
        success: true,
        data: rawData,
      };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(
        'Error ' + error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateFlashCardGeneric(
    tempId: string,
    userId: number,
    subscriptionType: SUBSCRIPTION_TYPE,
    workspaceId: number,
    transaction?: any,
  ) {
    const internalTransaction =
      transaction || (await this.sequelize.transaction());

    try {
      // Fetch flashcard with lean data
      const flashCard = await FlashCard.findOne({
        where: { temporary_flashcard_id: tempId },
        include: [
          {
            model: FlashCardRawData,
            as: 'raw_data',
            attributes: ['text', 'language'],
          },
        ],
        transaction: internalTransaction,
      });

      if (!flashCard?.raw_data?.length) {
        throw new HttpException(
          'No flashcard or raw data found.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const combinedText = flashCard.raw_data.map((r) => r.text).join('\n\n');
      const language = flashCard.raw_data[0].language;

      const generatedSlides = await generateFlashcardSlides(
        combinedText,
        language,
        subscriptionType,
      );

      let extractedJson;
      if (typeof generatedSlides === 'object') {
        extractedJson = generatedSlides;
      } else {
        const rawJson = extractJsonBlock(generatedSlides);
        if (!rawJson) throw new Error('No valid JSON found in OpenAI response');
        extractedJson = JSON.parse(rawJson);
      }

      if (!extractedJson || typeof extractedJson !== 'object') {
        throw new Error('Invalid parsedSlides data');
      }

      await this.storeParsedSlides(extractedJson, flashCard.id, transaction);

      await flashCard.update(
        {
          temporary_flashcard_id: null,
          user_id: userId,
          workspace_id: workspaceId,
        },
        { transaction: internalTransaction },
      );

      const workspace = await WorkSpace.findByPk(workspaceId, {
        transaction: internalTransaction,
      });

      const newCredits = workspace.credit - 5;

      workspace.credit = newCredits >= 0 ? newCredits : 0;

      await workspace.save({ transaction: internalTransaction });

      if (!transaction) {
        await internalTransaction.commit();
      }

      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Flash card created successfully',
          flashcard: flashCard,
        },
      };
    } catch (error) {
      if (!transaction) {
        await internalTransaction.rollback();
      }
      console.error('Flashcard generation error:', error);
      throw new HttpException(
        'Error: ' + error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateFirstFlashCard(id: string, req: any, outsideTransaction?: any) {
    const user = await User.findByPk(req.user.id, { attributes: ['plan_id'] });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const userPlan = await SubscriptionPlan.findByPk(user.plan_id, {
      attributes: ['plan_type'],
    });

    if (!userPlan) {
      throw new HttpException(
        'Subscription plan not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.generateFlashCardGeneric(
      id,
      req.user.id,
      userPlan.plan_type,
      undefined, // workspace will be fetched
      outsideTransaction,
    );
  }

  async generateFlashCard(
    dto: FlashCardGenerateDTO,
    req: any,
    outsideTransaction?: any,
  ) {
    // @fix optimize query
    const IsUserMemberofWorkSpace = await WorkSpace.findOne({
      where: {
        id: dto.workspace_id,
      },
      plain: true,
      include: [
        {
          required: true,
          model: User,
          as: 'members',
          attributes: ['id', 'plan_id'],
          where: {
            id: req.user.id,
          },
        },
      ],
    });

    if (!IsUserMemberofWorkSpace) {
      throw new HttpException(
        'You are not a member of this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    if (IsUserMemberofWorkSpace.credit <= 0) {
      throw new HttpException(
        'Insufficient workspace credits',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = IsUserMemberofWorkSpace.members[0];

    const userPlan = await SubscriptionPlan.findByPk(user.plan_id, {
      attributes: ['plan_type'],
      plain: true,
    });

    if (!userPlan) {
      throw new HttpException(
        'Subscription plan not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.generateFlashCardGeneric(
      dto.temporary_flashcard_id,
      req.user.id,
      userPlan.plan_type,
      dto.workspace_id,
      outsideTransaction,
    );
  }

  async uploadRawData(
    files: Express.Multer.File[],
    input: RawDataUploadDTO,
    req?: any,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      let flashCard;
      // If text is present and not empty, use text and skip file processing
      if (input.text) {
        flashCard = await FlashCard.create(
          {
            temporary_flashcard_id: uuidv4(),
            user_id: null,
            workspace_id: null,
          },
          { transaction },
        );
        if (!flashCard) {
          await transaction.rollback();
          throw new HttpException(
            'Error while creating flashcard',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        await FlashCardRawData.create(
          {
            text: input.text,
            title: input.title || '',
            data_type: DATA_TYPE.TEXT,
            flashcard_id: flashCard.id,
            language: input.language,
          },
          { transaction },
        );
      } else {
        const extractedTexts = [];
        for (const file of files) {
          const data = await this.pdfService.extractTextFromBuffer(file.buffer);
          extractedTexts.push(data);
        }
        flashCard = await FlashCard.create(
          {
            temporary_flashcard_id: uuidv4(),
            user_id: null,
            workspace_id: null,
          },
          { transaction },
        );
        if (!flashCard) {
          await transaction.rollback();
          throw new HttpException(
            'Error while creating flashcard',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        for (const item of extractedTexts) {
          const { text, title, data_type, file_size } = item;
          await FlashCardRawData.create(
            {
              text,
              title,
              data_type,
              file_size,
              flashcard_id: flashCard.id,
              language: input.language,
            },
            { transaction },
          );
        }
      }
      // if (input.workspaceId) {
      //   await this.generateFlashCard(
      //     {
      //       temporary_flashcard_id: flashCard.temporary_flashcard_id,
      //       workspace_id: +input.workspaceId,
      //     },
      //     req,
      //     transaction,
      //   );
      // }
      await transaction.commit();
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Upload successful',
          flashcard: flashCard,
          // temporary_flashcard_id: input.workspaceId
          //   ? null
          //   : flashCard.temporary_flashcard_id,
          // flashcard_id: flashCard.id,
        },
      };
    } catch (error) {
      console.log('error', error.message);
      await transaction.rollback();
      throw new HttpException('Error ' + error.message, error.status);
    }
  }
  // async uploadRawDataText(rawDataUploadDTO: RawDataUploadDTO, req: any) {
  //   const transaction = await this.sequelize.transaction();

  //   try {
  //     const flashCard = await FlashCard.create(
  //       {
  //         temporary_flashcard_id: uuidv4(),
  //         user_id: null,
  //         workspace_id: null,
  //       },
  //       { transaction },
  //     );

  //     if (!flashCard) {
  //       await transaction.rollback();
  //       throw new HttpException(
  //         'Error while creating flashcard',
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }

  //     for (const item of [rawDataUploadDTO]) {
  //       const { text, language } = item;

  //       await FlashCardRawData.create(
  //         {
  //           text,
  //           title: '',
  //           data_type: DATA_TYPE.TEXT,
  //           flashcard_id: flashCard.id,
  //           language: language,
  //         },
  //         { transaction },
  //       );
  //     }
  //     if (rawDataUploadDTO.workspaceId) {
  //       await this.generateFlashCard(
  //         {
  //           temporary_flashcard_id: flashCard.temporary_flashcard_id,
  //           workspace_id: +rawDataUploadDTO.workspaceId,
  //         },
  //         req,
  //         transaction,
  //       );
  //     }
  //     await transaction.commit();

  //     return {
  //       status: HttpStatus.OK,
  //       success: true,
  //       data: {
  //         message: 'Upload successful',
  //         temporary_flashcard_id: rawDataUploadDTO.workspaceId
  //           ? null
  //           : flashCard.temporary_flashcard_id,
  //       },
  //     };
  //   } catch (error) {
  //     console.log('error', error.message);
  //     await transaction.rollback();
  //     throw new HttpException('Error ' + error.message, error.status);
  //   }
  // }

  async getFlashCardById(id: number, req: any) {
    try {
      const flashCard = await FlashCard.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: FlashCardSlide,
            as: 'slides',
          },
          {
            model: FlashCardRawData,
            as: 'raw_data',
          },
        ],
      });
      if (!flashCard) {
        throw new HttpException('Flash card not found', HttpStatus.NOT_FOUND);
      }
      return flashCard;
    } catch (error) {
      console.log('error', error.message);

      throw new HttpException('Error ' + error.message, error.status);
    }
  }
  async getFlashCardByTempId(tempId: string, req: any) {
    try {
      const flashCard = await FlashCard.findOne({
        where: {
          temporary_flashcard_id: tempId,
        },
        include: [
          {
            model: FlashCardSlide,
            as: 'slides',
          },
          {
            model: FlashCardRawData,
            as: 'raw_data',
          },
        ],
      });
      if (!flashCard) {
        throw new HttpException('Flash card not found', HttpStatus.NOT_FOUND);
      }
      return flashCard;
    } catch (error) {
      console.log('error', error.message);

      throw new HttpException('Error ' + error.message, error.status);
    }
  }

  async storeParsedSlides(
    parsedSlides: Record<string, any[]>,
    flashcardId: number,
    transaction?: any,
  ) {
    const internalTransaction =
      transaction || (await this.sequelize.transaction());
    const slidesToInsert = Object.entries(parsedSlides).flatMap(
      ([key, slides]) => {
        const upperKey = key.toUpperCase().trim();

        if (!(upperKey in FLASHCARD_SLIDE_TYPE)) {
          console.warn(`⚠️ Skipping unknown slide type: ${key}`);
          return [];
        }

        const slideType =
          FLASHCARD_SLIDE_TYPE[upperKey as keyof typeof FLASHCARD_SLIDE_TYPE];

        if (!slideType) {
          console.warn(`Skipping unknown slide type: ${key}`);
          return [];
        }

        return slides.map((slide) => ({
          slide_type: slideType,
          title: slide.title || '',
          text: slide.text || '',
          flashcard_id: flashcardId,
        }));
      },
    );

    try {
      await FlashCardSlide.bulkCreate(slidesToInsert, {
        transaction: internalTransaction,
      });
      if (!transaction) await internalTransaction.commit();
      console.log('✅ Slides stored successfully!');
    } catch (error) {
      console.error('❌ Error saving slides:', error);
    }
  }
}
