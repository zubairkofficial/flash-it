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
import { WORKSPACE_USER_ROLE } from 'src/utils/workspace-user-role.enum';
import { Identifier } from 'sequelize';
import { WORKSPACE_USER_PERMISSION } from 'src/utils/permission.enum';

@Injectable()
export class WorkspaceService {
  constructor(
    // private sequelize: Sequelize
  ) {}
  async createWorkspace(createWorkspaceDTO: CreateWorkspaceDTO, req: any) {
    const { name } = createWorkspaceDTO;
    // const transaction = await this.sequelize.transaction();
    try {
      const existingUser = await User.findByPk(req.user.id);

      if (!existingUser) {
        throw new HttpException('no user logged IN', HttpStatus.BAD_REQUEST);
      }

      const workspace = await WorkSpace.create(
        {
          name,
          credit: 0,
          admin_user_id: existingUser.id,
        },
        // { transaction },
      );

      await WorkspaceUserPermission.create(
        {
          permission: WORKSPACE_USER_PERMISSION.RE,
          workspace_user_id: workspace.id,
        },
        // { transaction },
      );
      // await transaction.commit();
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'workspace created successfully',
          workspace: workspace,
        },
      };
    } catch (error) {
      // await transaction.rollback();
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
  async getWorkspaceById(id: number, req: any) {
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

  async invitedWorkspaceById(id: number, req: any) {
    try {
      let invite;
      // Find the user
      const existingUser = await User.findByPk(req.user.id);

      if (!existingUser) {
        throw new HttpException('No user exists', HttpStatus.BAD_REQUEST);
      }

      // Find the workspace
      const workSpace = await WorkSpace.findByPk(id);
      if (!workSpace) {
        throw new HttpException('No workspace found', HttpStatus.BAD_REQUEST);
      }
      const existInvite = await Invite.findOne({
        where: {
          admin_id: existingUser.id,
          workspace_id: workSpace.id,
        },
      });
      if (!existInvite) {
        // Create the invite using the user and workspace IDs
        invite = await Invite.create({
          admin_id: existingUser.id,
          workspace_id: workSpace.id,
        });
      }
      // Generate the base URL with the invite ID
      const baseUrl = `${process.env.BASE_URL_FRONTEND}/workspace/invited/${existInvite.id ?? invite.id}`;

      return { url: baseUrl };
    } catch (error) {
      throw new HttpException('Error: ' + error.message, error.status);
    }
  }
  async invitedById(id: string, req: any) {
    try {
      // Find the user
      const existingUser = await User.findByPk(req.user.id);

      if (!existingUser) {
        throw new HttpException('No user exists', HttpStatus.BAD_REQUEST);
      }

      // Find the workspace
      const invite = await Invite.findByPk(id);
      if (!invite) {
        throw new HttpException('No invite found', HttpStatus.BAD_REQUEST);
      }
      const workspaceUser = await WorkspaceUser.findOne({
        where: { user_id: existingUser.id, workspace_id: invite.workspace_id },
      });

      if (workspaceUser) {
        throw new HttpException(
          'already  part of this workspace',
          HttpStatus.BAD_REQUEST,
        );
      }

      const workspaceUserLimit = await WorkspaceUser.count({
        where: { workspace_id: invite.workspace_id },
      });

      if (workspaceUserLimit > 5) {
        throw new HttpException(
          'maximum limit exceeded',
          HttpStatus.BAD_REQUEST,
        );
      }

      return WorkspaceUser.create({
        role: WORKSPACE_USER_ROLE.MEMBER,
        user_id: existingUser.id,
        workspace_id: invite.workspace_id,
      });
    } catch (error) {
      throw new HttpException('Error: ' + error.message, error.status);
    }
  }

  async deleteWorkspace(
    workspaceId: string,
    userId: string,
    req: { user: { id: Identifier } },
  ) {
    try {
      // Find the user
      const existingUser = await User.findByPk(req.user.id);

      if (!existingUser) {
        throw new HttpException('No user exists', HttpStatus.BAD_REQUEST);
      }

      const workspaceUser = await WorkspaceUser.findOne({
        where: { user_id: userId, workspace_id: workspaceId },
      });

      if (!workspaceUser) {
        throw new HttpException(
          'User is not part of this workspace',
          HttpStatus.BAD_REQUEST,
        );
      }
      await workspaceUser.destroy();

      return { message: 'User successfully removed from workspace' };
    } catch (error) {
      throw new HttpException('Error: ' + error.message, error.status);
    }
  }
}
