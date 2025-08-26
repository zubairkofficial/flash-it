import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LoginDTO, RegisterDTO, UpdatePlanDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';

@Controller('auth')
export class AuthController {
  //we will need some temporary id, that browser send us and we can identify the related flashcard in the db and set that flash card against that registered/login user

  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    console.log('📌 Controller register called');

    return this.authService.register(registerDTO);
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-user-plan')
  async updateUserPlan(@Body() updatePlanDTO: UpdatePlanDTO, @Req() req: any) {
    return this.authService.updateUserPlan(updatePlanDTO, req);
  }
}
