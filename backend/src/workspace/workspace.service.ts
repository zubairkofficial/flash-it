import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkspaceDTO } from './dto/workspace.dto';
import User from 'src/models/user.model';
import WorkSpace from 'src/models/workspace.model';
import WorkspaceUser from 'src/models/workspace-user.model';
import WorkspaceUserPermission from 'src/models/workspace-user-permission.model';
import Invite from 'src/models/invite.model';
import FlashCard from 'src/models/flashcard.model';
import FlashCardSlide from 'src/models/flashcard-slide.model';
import FlashCardRawData from 'src/models/flashcard-raw-data.model';

@Injectable()
export class WorkspaceService {
  async createWorkspace(createWorkspaceDTO: CreateWorkspaceDTO, req: any) {
    const { name } = createWorkspaceDTO;

    try {
      const existingUser = await User.findByPk(req.user.id);

      if (!existingUser) {
        throw new HttpException('no user logged IN', HttpStatus.BAD_REQUEST);
      }

      const workspace = await WorkSpace.create({
        name,
        credit: 0,
        admin_user_id: existingUser.id,
      });

      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'workspace created successfully',
          workspace: workspace,
        },
      };
    } catch (error) {
      throw new HttpException('Error: ' + error.message, error.status);
    }
  }

  async updateWorkspace(id: string, req: any) {
    try {
    } catch (error) {
      throw new HttpException('Error: ' + error.message, error.status);
    }
  }
  async getWorkspace(req: any) {
    try {
      const existingUser = await User.findByPk(req.user.id);

      if (!existingUser) {
        throw new HttpException('No user exists', HttpStatus.BAD_REQUEST);
      }

      const workspaceUsers = await User.findAll({
        where: { id: req.user.id },
        include: [
          // {
          //   model: WorkSpace,
          //   as: 'workspaces', // If you want to include the workspace relation
          //   required: true, // Ensure the user is related to a workspace
          //   // include: [
          //   //   {
          //   //     model: User,
          //   //     as: 'member',
          //   //   },
          //   // ],
          // },
          {
            model: WorkSpace,
            as: 'joined_workspaces', // If you want to include the workspace relation
            required: true, // Ensure the user is related to a workspace
            // include: [
            //   {
            //     model: User,
            //     as: 'members',
            //   },
            // ],
          },
          // {
          //   model: WorkspaceUserPermission,
          //   as: 'workspace_user_permissions', // If you want to include the permissions relation
          //   required: false, // Optional, in case no permissions exist
          // },
          // {
          //   model: User,
          //   as: 'user', // If you want to include the user relation
          //   required: true, // Ensure the user exists
          // },
        ],
      });

      return workspaceUsers;
    } catch (error) {
      throw new HttpException('Error: ' + error.message, error.status);
    }
  }
  async getWorkspaceById(id: number,req: any) {
    try {
      const existingUser = await User.findByPk(req.user.id);

      if (!existingUser) {
        throw new HttpException('No user exists', HttpStatus.BAD_REQUEST);
      }

      const workspaceUsers = await WorkSpace.findOne({
        where: { id },
        include: [
          {
      model: User,
      as: 'admin', // Alias for the admin relationship
      required: true, // Ensure the admin is included
    },
          {
      model: User,
      as: 'members', // Alias for the members relationship
      required: true, // Ensure the members are included
    },
    {
      model: FlashCard,
      as: 'flashcards', // Alias for the flashcards relationship
      required: false, // Optional, if no flashcards exist
      include:[{
        model:FlashCardSlide,
        as:'slides',
      },
      {
        model:FlashCardRawData,
        as:'raw_data'
      }
    ]
    },
    {
      model: Invite,
      as: 'invites', // Alias for the invites relationship
      required: false, // Optional, if no invites exist
    },
        ],
      });

      return workspaceUsers;
    } catch (error) {
      throw new HttpException('Error: ' + error.message, error.status);
    }
  }
}
