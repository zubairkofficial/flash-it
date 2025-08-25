// src/guards/jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
// import { VerifyAccessToken } from 'src/utils/verifyToken.utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.token;
    if (!token) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: 'Authorization token is missing',
        error: 'Unauthorized',
      });
    }

    // const user = VerifyAccessToken(token);

    const user = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    if (user == 'TokenExpiredError') {
      console.log('toke is expired');
      throw new UnauthorizedException({
        statusCode: 4001,
        message: 'Authorization token is invalid',
        error: 'Unauthorized',
      });
    }
    if (user?.sub == null) {
      throw new UnauthorizedException({
        statusCode: 4002,
        message: 'Invalid token',
        error: 'Unauthorized',
      });
    }
    request.user = user;
    return true;
  }
}
