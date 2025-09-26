import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/plan.dto';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';

@Controller('plan')
export class PlanController {
  constructor(private planService: PlanService) {}

  @Get(':id')
  async getPlanByID(@Param('id') id: string | number) {
    return this.planService.getPlanByID(id);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createPlan( @Body() input: CreatePlanDto, @Req() req: any) {
    return this.planService.createPlan(input,req);
  }
}
