import { Body, Controller, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDTO } from './dto/workspace.dto';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Post('')
  // @fix add jwt Guards
  @UseGuards(JwtAuthGuard)
  async createWorkspace(
    @Body() createWorkspaceDTO: CreateWorkspaceDTO,
    @Req() req: any,
  ) {
    return this.workspaceService.createWorkspace(createWorkspaceDTO, req);
  }

  @Put(':id')
  // @fix add jwt Guards
  async updateWorkspace(@Param('id') id: string, @Req() req: any) {
    return this.workspaceService.updateWorkspace(id, req);
  }
}
