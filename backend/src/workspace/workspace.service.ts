import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkspaceDTO } from './dto/workspace.dto';
import User from 'src/models/user.model';
import WorkSpace from 'src/models/workspace.model';

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
}
