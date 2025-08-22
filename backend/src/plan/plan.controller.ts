import { Controller, Get, Param } from '@nestjs/common';
import { PlanService } from './plan.service';

@Controller('plan')
export class PlanController {
  constructor(private planService: PlanService) {}

  @Get(':id')
  async getPlanByID(@Param('id') id: string | number) {
    return this.planService.getPlanByID(id);
  }
}
