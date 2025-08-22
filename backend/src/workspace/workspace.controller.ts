import { Body, Controller, Param, Post, Put, Req } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDTO } from './dto/workspace.dto';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Post('')
  // @fix add jwt and roles Guards
  async createWorkspace(
    @Body() createWorkspaceDTO: CreateWorkspaceDTO,
    @Req() req: any,
  ) {
    return this.workspaceService.createWorkspace(createWorkspaceDTO, req);
  }

  @Put(':id')
  // @fix add jwt and roles Guards
  async updateWorkspace(@Param('id') id: string, @Req() req: any) {
    return this.workspaceService.updateWorkspace(id, req);
  }
}
