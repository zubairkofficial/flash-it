import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO, UpdatePlanDTO } from './dto/auth.dto';
import { Sequelize } from 'sequelize-typescript';
import User from 'src/models/user.model';
import FlashCard from 'src/models/flashcard.model';
import { Op } from 'sequelize';
import WorkSpace from 'src/models/workspace.model';
import { FlashcardService } from 'src/flashcard/flashcard.service';
import { SubscriptionPlan } from 'src/models/subscription-plan.model';
import { SUBSCRIPTION_TYPE } from 'src/utils/subscription.enum';
import { generateToken } from 'src/utils/jwt.utils';
import WorkspaceUser from 'src/models/workspace-user.model';
import { WORKSPACE_USER_ROLE } from 'src/utils/workspace-user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private sequelize: Sequelize,
    private flashCardService: FlashcardService,
  ) {}

  async register(registerDTO: RegisterDTO) {
    const { name, email, password, temporary_flashcard_id } = registerDTO;
    const transaction = await this.sequelize.transaction();
    try {
      const userExist = await User.findOne({
        where: {
          email: {
            [Op.eq]: email,
          },
        },
        transaction,
      });
      console.log('asdfsadfasdfasdfsadfsad=======================', userExist);
      if (userExist) {
        await transaction.rollback();
        throw new HttpException('User Already Exist', HttpStatus.BAD_REQUEST);
      }

      const plan = await SubscriptionPlan.findOne({
        where: {
          plan_type: {
            [Op.eq]: SUBSCRIPTION_TYPE.FREE,
          },
        },
      });

      // if (plan) {

      // }
      // @fix check if plan exist in DB
      const newUser = await User.create(
        {
          name,
          email,
          password: registerDTO.password,
          plan_id: plan.id,
        },
        {
          transaction,
        },
      );

      const defaultWorkspace = await WorkSpace.create(
        {
          name: newUser.name + "'s " + 'WorkSpace',
          credit: 0,
          admin_user_id: newUser.id,
        },
        {
          transaction,
        },
      );

     await WorkspaceUser.create({
     workspace_id:defaultWorkspace.id,
     user_id:newUser.id,
     role:WORKSPACE_USER_ROLE.ADMIN},
       {
          transaction,
        },
 )

      if (temporary_flashcard_id && defaultWorkspace) {

              // @fix find flashcard against temp_id if it exist


        await this.flashCardService.generateFlashCard(
          {
            temporary_flashcard_id,
            workspace_id: defaultWorkspace.id,
          },
          {
            user: {
              id: newUser.id,
            },
          },
          transaction,
        );

      }

      const { password, ...safeUser } = newUser;
      
      const token = generateToken({ id: safeUser.dataValues.id, email: safeUser.dataValues.email });
     
      await transaction.commit();
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'SignUP successfull',
          token: token, // @fix generate jwt token
          user: safeUser,
          workspace_id: defaultWorkspace.id,
        },
      };
    } catch (error: any) {
      console.log('erre register ----------', error);
      await transaction.rollback();

      throw new HttpException(
        'Error: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDTO: LoginDTO) {
    const { email, temporary_flashcard_id } = loginDTO;
    const transaction = await this.sequelize.transaction();
    try {
      const existingUser = await User.findOne({
        where: {
          email: {
            [Op.eq]: email,
          },
        },
      });

      if (!existingUser) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      const isValid = await existingUser.validatePassword(loginDTO.password);

      if (!isValid) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      if (temporary_flashcard_id) {
        const tempFlashCard = await FlashCard.findOne({
          where: {
            [Op.and]: [
              { temporary_flashcard_id: { [Op.eq]: temporary_flashcard_id } },
              { temporary_flashcard_id: { [Op.ne]: null } },
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
        });

        if (tempFlashCard) {
          await tempFlashCard.update(
            {
              user_id: existingUser.id,
              workspace_id: existingUser.plan_id,
              temporary_flashcard_id: null,
            },
            {
              transaction,
            },
          );
        }
      }

      const { password, ...sendUserData } = existingUser;
     
      const token = generateToken({ id: sendUserData.dataValues.id, email: sendUserData.dataValues.email });
      
      await transaction.commit();
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Login Successfull successfull',
          user: sendUserData,
          token: token, 
        },
      };
    } catch (error: any) {
      await transaction.rollback();
      throw new HttpException(
        'Error: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserPlan(updatePlanDTO: UpdatePlanDTO, req: any) {
    const { plan_id } = updatePlanDTO;

    try {
      const existingPlan = await SubscriptionPlan.findOne({
        where: {
          id: {
            [Op.eq]: plan_id,
          },
        },
      });

      if (!existingPlan) {
        throw new HttpException('no plan exist', HttpStatus.NOT_FOUND);
      }

      const existingUser = await User.findByPk(req.user.id);
      if (!existingUser) {
        throw new HttpException('no user logged IN', HttpStatus.NOT_FOUND);
      }

      await existingUser.update({
        plan_id: existingPlan.id,
      });

      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Plan Updated Successfully',
          plan: existingPlan,
        },
      };
    } catch (error) {
      throw new HttpException('Error: ' + error.message, error.status);
    }
  }
}
