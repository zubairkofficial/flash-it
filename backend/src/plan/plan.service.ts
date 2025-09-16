import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { SubscriptionPlan } from 'src/models/subscription-plan.model';
import { CreatePlanDto } from './dto/plan.dto';
import User from 'src/models/user.model';
import FlashCard from 'src/models/flashcard.model';
import { Sequelize } from 'sequelize-typescript';
import WorkSpace from 'src/models/workspace.model';

@Injectable()
export class PlanService {
  constructor(private sequelize: Sequelize){}
  async getPlanByID(id: string | number) {
    try {
      const numberID: number = Number(id);

      if (typeof numberID !== 'number') {
        throw new HttpException('id must be a number', HttpStatus.BAD_REQUEST);
      }

      const plan =await SubscriptionPlan.findOne({
        where: {
          id: {
            [Op.eq]: Number(id),
          },
        },
      });
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'getting plan successfull',
          plan: plan,
        },
      };
    } catch (error) {
      throw new HttpException('Error: ' + error.message, error.status);
    }
  }
  async createPlan(input: CreatePlanDto, req: any) {
    const transaction = await this.sequelize.transaction(); 
    try {
      let workspace
   
      const plan = await SubscriptionPlan.findOne({
        where: { plan_type: input.subscriptionType },
        transaction,
      });
  
      if (!plan) {
        throw new HttpException("Subscribe plan not found", HttpStatus.BAD_REQUEST);
      }
  
      const user = await User.findByPk(req.user.id, { transaction });
      if (!user) {
        throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
      }
  
     
      user.plan_id = plan.id;
      await user.save({ transaction });
  
      // Handle temporary flashcard (if provided)
      if (input.tempId) {
        const flashcard = await FlashCard.findOne({
          where: { temporary_flashcard_id: input.tempId },
          transaction,
        });
  
        if (!flashcard) {
          throw new HttpException("Flashcard not found", HttpStatus.BAD_REQUEST);
        }
         workspace= await WorkSpace.findOne({where:{admin_user_id:req.user.id}})
  
        flashcard.temporary_flashcard_id = null;
        flashcard.user_id = req.user.id;
        flashcard.workspace_id = workspace.id;
        
        await flashcard.save({ transaction });
      }
  
      // Commit transaction
      await transaction.commit();
  
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: `${input.subscriptionType} subscription plan successful`,
          plan: plan,
          workspaceId:workspace.id

        },
      };
  
    } catch (error) {
      await transaction.rollback(); // Rollback on error
      throw new HttpException('Error: ' + error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  


 
}
