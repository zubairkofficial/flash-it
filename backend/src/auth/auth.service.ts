import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { Sequelize } from 'sequelize-typescript';
import User from 'src/models/user.model';
import FlashCard from 'src/models/flashcard.model';
import { Op } from 'sequelize';
import WorkSpace from 'src/models/workspace.model';
import { FlashcardService } from 'src/flashcard/flashcard.service';

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
      });
      if (userExist) {
        await transaction.rollback()
        throw new HttpException('User Already Exist', HttpStatus.BAD_REQUEST);
      }

      const newUser = await User.create(
        {
          name,
          email,
          password,
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
          plan_id: 1, // @fix make it dynamic
        },
        {
          transaction,
        },
      );

      if (temporary_flashcard_id && defaultWorkspace) {
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

        // const tempFlashCard = await FlashCard.findOne({
        //   where: {
        //     [Op.and]: [
        //       { temporary_flashcard_id: { [Op.eq]: temporary_flashcard_id } },
        //       { temporary_flashcard_id: { [Op.ne]: null } },
        //       {
        //         user_id: {
        //           [Op.eq]: null,
        //         },
        //       },
        //       {
        //         workspace_id: {
        //           [Op.eq]: null,
        //         },
        //       },
        //     ],
        //   },
        // });

        // if (tempFlashCard) {
        //   await tempFlashCard.update(
        //     {
        //       user_id: newUser.id,
        //       temporary_flashcard_id: null,
        //       workspace_id: defaultWorkspace.id,
        //     },
        //     {
        //       transaction,
        //     },
        //   );
        // }
      }

      await transaction.commit();
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'SignUP successfull',
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
            ],
          },
        });

        if (tempFlashCard) {
          await tempFlashCard.update(
            {
              user_id: existingUser.id,
              temporary_flashcard_id: null,
            },
            {
              transaction,
            },
          );
        }
      }

      const { password, ...sendUserData } = existingUser;

      await transaction.commit();
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Login Successfull successfull',
          user: sendUserData,
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
}
