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
  
      await transaction.commit(); // ✅ Commit once all is good
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: `${input.subscriptionType} subscription plan successful`,
          plan: plan,
          // workspaceId:workspace.id

        },
      };

    } catch (error) {
      // ✅ Only rollback if not already committed or rolled back
      if (!(transaction as any).finished) {
        await transaction.rollback();
      }
  
      throw error; // Or handle/log it
    }
  }
  
  


 
}
