import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from './dto/workspace.dto';
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
import { Sequelize } from 'sequelize-typescript';
import { WORKSPACE_USER_PERMISSION } from 'src/utils/permission.enum';

@Injectable()
export class WorkspaceService {
  constructor(
    private sequelize: Sequelize
  ) {}
  async createWorkspace(createWorkspaceDTO: CreateWorkspaceDTO, req: any) {
    const { name,credits,role } = createWorkspaceDTO;
    const transaction = await this.sequelize.transaction();
    try {
      const existingUser = await User.findByPk(req.user.id);

      if (!existingUser) {
        throw new HttpException('no user logged IN', HttpStatus.BAD_REQUEST);
      }

      const workspace = await WorkSpace.create(
        {
          name,
          credit: credits,
          admin_user_id: existingUser.id,
        },
        { transaction },
      );
      const workspaceUser = await WorkspaceUser.create(
        {
         role: WORKSPACE_USER_ROLE.ADMIN,
         user_id: existingUser.id,
         workspace_id: workspace.id,
        
        },
        { transaction },
      );

      await WorkspaceUserPermission.create(
        {
          permissions: WORKSPACE_USER_PERMISSION.RE,
          workspace_user_id: workspaceUser.id,
        },
        { transaction },
      );
      await transaction.commit();
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

  async updateWorkspace(
    id: string,
    updateWorkspaceDTO: UpdateWorkspaceDTO,
    req: any
  ) {
    const transaction = await this.sequelize.transaction();
  
    try {
      const userId = req.user.id;
  
      // Fetch user
      const existingUser = await User.findByPk(userId, { transaction });
      if (!existingUser) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
  
   
      const workspace = await WorkSpace.findByPk(id, { transaction });
      if (!workspace) {
        throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
      }
  
     
      if (workspace.admin_user_id !== userId) {
        throw new HttpException(
          'Only the workspace admin can update the workspace',
          HttpStatus.FORBIDDEN
        );
      }
      
  
      if(updateWorkspaceDTO.credits)
        {
          if(existingUser.credits>updateWorkspaceDTO.credits){
            existingUser.credits=existingUser.credits-updateWorkspaceDTO.credits
          }else{
            throw new HttpException('Recharge your account', HttpStatus.BAD_REQUEST);
  
          }

          workspace.credit=updateWorkspaceDTO.credits

        }
      // Update workspace name
      if (updateWorkspaceDTO.name) {
        workspace.name = updateWorkspaceDTO.name;
        await workspace.save({ transaction });
        await existingUser.save({ transaction });
      }
  
      // Update user role in workspace
      if (updateWorkspaceDTO.role) {
        const workspaceUser =   await WorkspaceUser.findOne({
          where: { workspace_id: +id, user_id: userId },
          transaction,
        });
  
        if (!workspaceUser) {
          throw new HttpException(
            'Workspace user not found',
            HttpStatus.NOT_FOUND
          );
        }
  
        const workspacePermission = await WorkspaceUserPermission.findOne({
          where: { workspace_user_id: workspaceUser.id },
          transaction,
        });
  
        if (!workspacePermission) {
          throw new HttpException(
            'Workspace permission not found',
            HttpStatus.NOT_FOUND
          );
        }
  
        workspacePermission.permissions = updateWorkspaceDTO.role;
        await workspacePermission.save({ transaction });
      }
  
      await transaction.commit();
  
      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Workspace updated successfully',
          workspace,
        },
      };
    } catch (error) {
      await transaction.rollback();
      const status =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      throw new HttpException(
        error.message || 'An error occurred while updating the workspace',
        status
      );
    }
  }
  

  // async updateWorkspace(id: string, updateWorkspaceDTO: UpdateWorkspaceDTO, req: any) {
  //   try {
  //     const existingUser = await User.findByPk(req.user.id);

  //     if (!existingUser) {
  //       throw new HttpException('No user exists', HttpStatus.BAD_REQUEST);
  //     }

  //     const workspace = await WorkSpace.findByPk(id);
  //     if (!workspace) {
  //       throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
  //     }

  //     // Check if user is admin of the workspace
  //     if (workspace.admin_user_id !== existingUser.id) {
  //       throw new HttpException('Only workspace admin can update workspace', HttpStatus.FORBIDDEN);
  //     }

  //     // Update workspace name if provided
  //     if (updateWorkspaceDTO.name) {
  //       workspace.name = updateWorkspaceDTO.name;
  //     }

  //     await workspace.save();

  //     // Update role if provided
  //     if (updateWorkspaceDTO.role) {
  //       const workspaceUser = await WorkspaceUser.findOne({
  //         where: { workspace_id: id, user_id: existingUser.id }
  //       });

  //       if (workspaceUser) {
  //         workspaceUser.role = updateWorkspaceDTO.role as WORKSPACE_USER_ROLE;
  //         await workspaceUser.save();
  //       }
  //     }

  //     return {
  //       status: HttpStatus.OK,
  //       success: true,
  //       data: {
  //         message: 'Workspace updated successfully',
  //         workspace: workspace,
  //       },
  //     };
  //   } catch (error) {
  //     throw new HttpException('Error: ' + error.message, error.status);
  //   }
  // }
  async getWorkspace(req: any) {
    try {
      const existingUser = await User.findByPk(req.user.id);

      if (!existingUser) {
        throw new HttpException('No user exists', HttpStatus.BAD_REQUEST);
      }

      const workspaceUsers = await User.findAll({
        where: { id: req.user.id },
        include: [
           {
            model: WorkSpace,
            as: 'joined_workspaces', // If you want to include the workspace relation
            required: true, // Ensure the user is related to a workspace
          
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
      const baseUrl = `${process.env.BASE_URL_FRONTEND}/workspace/invited/${existInvite?.id ?? invite?.id}`;

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

  async removeUserFromWorkspace(
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

  async deleteWorkspace(id: string, req: any) {
    const transaction = await this.sequelize.transaction();
    try {
      const existingUser = await User.findByPk(req.user.id);

      if (!existingUser) {
        throw new HttpException('No user exists', HttpStatus.BAD_REQUEST);
      }

      const workspace = await WorkSpace.findByPk(id);
      if (!workspace) {
        throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
      }

      // Check if user is part of the workspace
      const workspaceUser = await WorkspaceUser.findOne({
        where: { workspace_id: id, user_id: existingUser.id },
        include: [{
          model: WorkspaceUserPermission,
          as: 'workspace_user_permissions'
        }]
      });

      if (!workspaceUser) {
        throw new HttpException('User is not part of this workspace', HttpStatus.FORBIDDEN);
      }

      // Check permissions - only CRUDE permission allows deletion
      if (workspaceUser.dataValues.role!==WORKSPACE_USER_ROLE.ADMIN 
        // || workspaceUser.workspace_user_permissions?.permissions !== WORKSPACE_USER_PERMISSION.CRUDE
      ) {
        throw new HttpException('Insufficient permissions to delete workspace', HttpStatus.FORBIDDEN);
      }

      // Check if user is admin of the workspace
      if (workspace.admin_user_id !== existingUser.id) {
        throw new HttpException('Only workspace admin can delete workspace', HttpStatus.FORBIDDEN);
      }

      // Delete all related data
      await WorkspaceUserPermission.destroy({
        where: { workspace_user_id: workspaceUser.id },
        transaction
      });

      await WorkspaceUser.destroy({
        where: { workspace_id: id },
        transaction
      });

      await workspace.destroy({ transaction });

      await transaction.commit();

      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          message: 'Workspace deleted successfully',
        },
      };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException('Error: ' + error.message, error.status);
    }
  }

  async getUserPermissions(workspaceId: string, req: any) {
    try {
      const existingUser = await User.findByPk(req.user.id);

      if (!existingUser) {
        throw new HttpException('No user exists', HttpStatus.BAD_REQUEST);
      }

      const workspaceUser = await WorkspaceUser.findOne({
        where: { workspace_id: workspaceId, user_id: existingUser.id },
        include: [{
          model: WorkspaceUserPermission,
          as: 'workspace_user_permissions'
        }]
      });

      if (!workspaceUser) {
        throw new HttpException('User is not part of this workspace', HttpStatus.FORBIDDEN);
      }

      return {
        status: HttpStatus.OK,
        success: true,
        data: {
          role: workspaceUser.role,
          permissions: workspaceUser.workspace_user_permissions?.permissions,
          canUpdate: workspaceUser.workspace_user_permissions?.permissions === WORKSPACE_USER_PERMISSION.CRUDE,
          canDelete: workspaceUser.workspace_user_permissions?.permissions === WORKSPACE_USER_PERMISSION.CRUDE && workspaceUser.workspace?.admin_user_id === existingUser.id,
        },
      };
    } catch (error) {
      throw new HttpException('Error: ' + error.message, error.status);
    }
  }
}
