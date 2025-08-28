import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDTO } from './dto/workspace.dto';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  // @fix add jwt Guards
  @UseGuards(JwtAuthGuard)
  async createWorkspace(
    @Body() createWorkspaceDTO: CreateWorkspaceDTO,
    @Req() req: any,
  ) {
    return this.workspaceService.createWorkspace(createWorkspaceDTO, req);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  // @fix add jwt Guards
  async updateWorkspace(@Param('id') id: string, @Req() req: any) {
    return this.workspaceService.updateWorkspace(id, req);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getWorkspace( @Req() req: any) {
    return this.workspaceService.getWorkspace( req);
  }
  
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getWorkspaceById( @Param('id') id:string, @Req() req: any) {
    return this.workspaceService.getWorkspaceById(+id, req);
  }
  
  @Get('/invite/:workspace_id')
  @UseGuards(JwtAuthGuard)
  async invitedWorkspaceById( @Param('workspace_id') workspace_id:string, @Req() req: any) {
    return this.workspaceService.invitedWorkspaceById(+workspace_id, req);
  }

  @Get('/invited/:id')
  @UseGuards(JwtAuthGuard)
  async invitedById( @Param('id') id:string, @Req() req: any) {
    return this.workspaceService.invitedById(id, req);
  }


  @Delete('/:workspace_id/:user_id')
  @UseGuards(JwtAuthGuard)
  async deleteWorkspace(
  @Param('workspace_id') workspaceId: string, 
  @Param('user_id') userId: string,
  @Req() req: any
) {
    return this.workspaceService.deleteWorkspace(workspaceId, userId, req);
  }

}
