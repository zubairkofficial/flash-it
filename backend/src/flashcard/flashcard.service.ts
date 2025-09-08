import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FlashCardFirstGenerateDTO, FlashCardGenerateDTO, RawDataUploadDTO } from './dto/flashcard.dto';
import { Sequelize } from 'sequelize-typescript';
import FlashCardRawData from 'src/models/flashcard-raw-data.model';
import FlashCard from 'src/models/flashcard.model';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { FLASHCARD_SLIDE_TYPE } from 'src/utils/flashcard-slide-type.enum';
import FlashCardSlide from 'src/models/flashcard-slide.model';
import { extractJsonBlock, generateFlashcardSlides } from 'src/utils/openai-flashCard.utils';
import { PdfService } from 'src/utils/pdf';
import { PlanController } from 'src/plan/plan.controller';
import { SubscriptionPlan } from 'src/models/subscription-plan.model';
import User from 'src/models/user.model';
import WorkSpace from 'src/models/workspace.model';
import { SUBSCRIPTION_TYPE } from 'src/utils/subscription.enum';


@Injectable()
export class FlashcardService {
  constructor(private sequelize: Sequelize,private pdfService:PdfService) {}
  async generateFlashCard(
    flashCardGenerateDTO: FlashCardGenerateDTO,
    req: any,
    outsideTransaction: any,
  ) {
    console.log("came in flashcard generate");
  
    let transaction: any = outsideTransaction || await this.sequelize.transaction();
    const { temporary_flashcard_id, workspace_id } = flashCardGenerateDTO;
  
    try {
      // 1. Get flashcard and raw data
      const flashCard = await FlashCard.findOne({
        where: {
          temporary_flashcard_id: {
            [Op.eq]: temporary_flashcard_id,
          },
        },
        include: [
          {
            model: FlashCardRawData,
            as: 'raw_data',
          },
        ],
        transaction,
      });
      const user=await User.findByPk(req.user.id)
if(!user)throw new HttpException('user not found: ' , HttpStatus.NOT_FOUND);
      const userPlan = await SubscriptionPlan.findOne({
      where:{id:user.plan_id},
        transaction,
      });
  
      if (!flashCard || !flashCard.raw_data || flashCard.raw_data.length === 0) {
        throw new HttpException('No flashcard or raw data found.', HttpStatus.BAD_REQUEST);
      }
  
      const combinedText = flashCard.raw_data
  .map(raw => raw.dataValues.text)
  .join('\n\n'); // or '\n', depending on your preference

  const language = flashCard.raw_data[0].dataValues.language;
    
  const generatedSlides = await generateFlashcardSlides(combinedText, language,userPlan.plan_type);
        console.log("generatedSlides", typeof generatedSlides);
        let extractedJson;
        if (typeof generatedSlides === 'object') {
          // If it's already a parsed object, just use it directly
          extractedJson = JSON.stringify(generatedSlides);
        } else {
          // If it's a string, try to extract JSON
          extractedJson = extractJsonBlock(generatedSlides);
        }
        
        if (!extractedJson) {
          throw new Error('No valid JSON found in OpenAI response');
        }
        
        let parsedSlides;
        try {
          parsedSlides = JSON.parse(extractedJson);
        } catch (error) {
          console.log("JSON parse error:", error.message);
          throw new Error(error.message || 'Failed to parse JSON');
        }
  
        if (!parsedSlides || typeof parsedSlides !== 'object') {
          throw new Error('Invalid parsedSlides data');
        }
  
        await this.storeParsedSlides(parsedSlides, flashCard.id);
      
  
      // 3. Update flashcard to attach user & workspace, remove temp ID
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
  
      // 4. Final commit
      if (!outsideTransaction) {
        await transaction.commit();
      }
  
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Flash card created successfully',
          flash_card: flashCard,
        },
      };
    } catch (error) {
      console.log('Flashcard generation error:', error);
  
      if (!outsideTransaction) {
        await transaction.rollback();
      }
  
      throw new HttpException('Error: ' + error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async generateFirstFlashCard(
    input: FlashCardFirstGenerateDTO,
    req: any,
    outsideTransaction: any,
  ) {
    console.log("came in flashcard generate");
  
    let transaction: any = outsideTransaction || await this.sequelize.transaction();
    const { tempId } = input;
  
    try {
      // 1. Get flashcard and raw data
      const flashCard = await FlashCard.findOne({
        where: {
          temporary_flashcard_id: {
            [Op.eq]: tempId,
          },
        },
        include: [
          {
            model: FlashCardRawData,
            as: 'raw_data',
          },
        ],
        transaction,
      });
//       const user=await User.findByPk(req.user.id)
// if(!user)throw new HttpException('user not found: ' , HttpStatus.NOT_FOUND);
//       const userPlan = await SubscriptionPlan.findOne({
//       where:{user_id:user.plan_id},
//         transaction,
//       });
  
      if (!flashCard || !flashCard.raw_data || flashCard.raw_data.length === 0) {
        throw new HttpException('No flashcard or raw data found.', HttpStatus.BAD_REQUEST);
      }
  
      const combinedText = flashCard.raw_data
  .map(raw => raw.dataValues.text)
  .join('\n\n'); // or '\n', depending on your preference

  const language = flashCard.raw_data[0].dataValues.language;
    
  const generatedSlides = await generateFlashcardSlides(combinedText, language,SUBSCRIPTION_TYPE.FREE);
        console.log("generatedSlides", typeof generatedSlides);
        let extractedJson;
        if (typeof generatedSlides === 'object') {
          // If it's already a parsed object, just use it directly
          extractedJson = JSON.stringify(generatedSlides);
        } else {
          // If it's a string, try to extract JSON
          extractedJson = extractJsonBlock(generatedSlides);
        }
        
        if (!extractedJson) {
          throw new Error('No valid JSON found in OpenAI response');
        }
        
        let parsedSlides;
        try {
          parsedSlides = JSON.parse(extractedJson);
        } catch (error) {
          console.log("JSON parse error:", error.message);
          throw new Error(error.message || 'Failed to parse JSON');
        }
  
        if (!parsedSlides || typeof parsedSlides !== 'object') {
          throw new Error('Invalid parsedSlides data');
        }
  
        await this.storeParsedSlides(parsedSlides, flashCard.id);
      
      const workspace=await  WorkSpace.findOne({where:{admin_user_id:req.user.id}})
      // 3. Update flashcard to attach user & workspace, remove temp ID
      await flashCard.update(
        {
          temporary_flashcard_id: null,
          user_id: req.user.id,
          workspace_id: workspace.id,
        },
        {
          transaction,
        },
      );
  
      // 4. Final commit
      if (!outsideTransaction) {
        await transaction.commit();
      }
  
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Flash card created successfully',
          flash_card: flashCard,
        },
      };
    } catch (error) {
      console.log('Flashcard generation error:', error);
  
      if (!outsideTransaction) {
        await transaction.rollback();
      }
  
      throw new HttpException('Error: ' + error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async uploadRawData(files: Express.Multer.File[],language: string, req: any) {
    const extractedTexts = [];

    for (const file of files) {
      const data = await this.pdfService.extractTextFromBuffer(file.buffer);
      extractedTexts.push(data);
    }
     const transaction = await this.sequelize.transaction();
  
    try {
      const flashCard = await FlashCard.create(
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
        const { text, title, data_type } = item;
  
        await FlashCardRawData.create(
          {
            text,
            title,
            data_type,
            flashcard_id: flashCard.id,
            language
          },
          { transaction },
        );
      }
  
      await transaction.commit();
  
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Upload successful',
          temporary_flashcard_id: flashCard.temporary_flashcard_id,
        },
      };
    } catch (error) {
      console.log('error', error.message);
      await transaction.rollback();
      throw new HttpException('Error ' + error.message, error.status);
    }
  }
  async uploadRawDataText(rawDataUploadDTO: RawDataUploadDTO, req: any) {
   
     const transaction = await this.sequelize.transaction();
  
    try {
      const flashCard = await FlashCard.create(
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
  
      for (const item of [rawDataUploadDTO]) {
        const { text, title, data_type,language } = item;
  
        await FlashCardRawData.create(
          {
            text,
            title,
            data_type,
            flashcard_id: flashCard.id,
            language:language
           },
          { transaction },
        );
      }
  
      await transaction.commit();
  
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Upload successful',
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
