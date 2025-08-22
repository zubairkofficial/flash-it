import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { SubscriptionPlan } from 'src/models/subscription-plan.model';

@Injectable()
export class PlanService {
  async getPlanByID(id: string | number) {
    try {
      const numberID: number = Number(id);

      if (typeof numberID !== 'number') {
        throw new HttpException('id must be a number', HttpStatus.BAD_REQUEST);
      }

      const plan = SubscriptionPlan.findOne({
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


 
}
