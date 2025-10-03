import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChangePasswordDTO,
  LoginDTO,
  RegisterDTO,
  UpdatePlanDTO,
  UpdateProfileDTO,
} from './dto/auth.dto';
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
import WorkspaceUserPermission from 'src/models/workspace-user-permission.model';
import { WORKSPACE_USER_PERMISSION } from 'src/utils/permission.enum';

@Injectable()
export class AuthService {
  constructor(
    private sequelize: Sequelize,
    private flashCardService: FlashcardService,
  ) {}

  async register(registerDTO: RegisterDTO) {
    const { name, email, temporary_flashcard_id } = registerDTO;
    const transaction = await this.sequelize.transaction();
    try {
      const userExist = await User.findOne({
        where: {
          email: {
            [Op.eq]: email,
          },
        },
        plain: true,
        transaction,
      });
      console.log('asdfsadfasdfasdfsadfsad=======================', userExist);
      if (userExist) {
        // await transaction.rollback();
        throw new HttpException('User Already Exist', HttpStatus.BAD_REQUEST);
      }

      const plan = await SubscriptionPlan.findOne({
        where: {
          plan_type: {
            [Op.eq]: SUBSCRIPTION_TYPE.FREE,
          },
        },
      });

      const newUser = await User.create(
        {
          name,
          email,
          password: registerDTO.password,
          plan_id: plan.id,
          credits: plan.credits,
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

      const workspaceUser = await WorkspaceUser.create(
        {
          workspace_id: defaultWorkspace.id,
          user_id: newUser.id,
          role: WORKSPACE_USER_ROLE.ADMIN,
        },
        {
          transaction,
        },
      );

      await WorkspaceUserPermission.create(
        {
          permissions: WORKSPACE_USER_PERMISSION.CRUDE,
          workspace_user_id: workspaceUser.id,
        },
        {
          transaction,
        },
      );

      if (temporary_flashcard_id && defaultWorkspace) {
        // @fix find flashcard against temp_id if it exist
        // await this.flashCardService.generateFlashCard(
        //   {
        //     temporary_flashcard_id,
        //     workspace_id: defaultWorkspace.id,
        //   },
        //   {
        //     user: {
        //       id: newUser.id,
        //     },
        //   },
        //   transaction,
        // );
      }

      const plainUser = newUser.get({ plain: true });
      const { password, ...safeUser } = plainUser;

      const token = generateToken({
        id: safeUser.id,
        email: safeUser.email,
      });

      await transaction.commit();
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'SignUP successfull',
          token: token,
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
        plain: true,
      });

      if (!existingUser) {
        throw new UnauthorizedException('No User Exist');
      }

      const isValid = await existingUser.validatePassword(loginDTO.password);

      if (!isValid) {
        throw new UnauthorizedException('Password is incorrect');
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
      const plainUser = existingUser.get({ plain: true });
      const { password, ...sendUserData } = plainUser;
      console.log('plainUser plainUser plainUser ----------', plainUser);
      const token = generateToken({
        id: sendUserData.id,
        email: sendUserData.email,
      });

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

  async getUserById(id: number) {
    try {
      const existingUser = await User.findOne({
        where: {
          id: {
            [Op.eq]: id,
          },
        },
      });

      if (!existingUser) {
        throw new NotFoundException('user not exist');
      }

      return existingUser;
    } catch (error: any) {
      throw new HttpException(
        'Error: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserPlan(updatePlanDTO: UpdatePlanDTO, req: any) {
    const { subscribePlan } = updatePlanDTO;

    try {
      const existingPlan = await SubscriptionPlan.findOne({
        where: {
          plan_type: {
            [Op.eq]: subscribePlan,
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
        credits: existingUser.credits + existingPlan.credits,
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

  async updateProfile(updateProfileDTO: UpdateProfileDTO, req: any) {
    try {
      const existingUser = await User.findByPk(req.user.id);
      if (!existingUser) {
        throw new HttpException('no user logged IN', HttpStatus.NOT_FOUND);
      }

      const { name, email, avatar_url } = updateProfileDTO;
      await existingUser.update({
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        ...(avatar_url ? { avatar_url } : {}),
      });

      const { password, ...safeUser } = existingUser as any;
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Profile Updated Successfully',
          user: safeUser,
        },
      };
    } catch (error: any) {
      throw new HttpException(
        'Error: ' + error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfile(req: any) {
    try {
      const existingUser = await User.findByPk(req.user.id);
      if (!existingUser) {
        throw new HttpException('no user logged IN', HttpStatus.NOT_FOUND);
      }
      const plainUser = existingUser.get({ plain: true });
      const { password, ...safeUser } = plainUser;

      return safeUser;
    } catch (error: any) {
      throw new HttpException(
        'Error: ' + error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changePassword(changePasswordDTO: ChangePasswordDTO, req: any) {
    const { currentPassword, newPassword } = changePasswordDTO;
    try {
      const existingUser = await User.findByPk(req.user.id);
      if (!existingUser) {
        throw new HttpException('no user logged IN', HttpStatus.NOT_FOUND);
      }

      const isValid = await existingUser.validatePassword(currentPassword);
      if (!isValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      existingUser.password = newPassword;
      await existingUser.save();

      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Password changed successfully',
        },
      };
    } catch (error: any) {
      throw new HttpException(
        'Error: ' + error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
