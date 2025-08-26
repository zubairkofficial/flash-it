import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
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
  // @fix add jwt Guards
  async getWorkspace( @Req() req: any) {
    return this.workspaceService.getWorkspace( req);
  }
  
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  // @fix add jwt Guards
  async getWorkspaceById( @Param('id') id:string, @Req() req: any) {
    return this.workspaceService.getWorkspaceById(+id, req);
  }
}
