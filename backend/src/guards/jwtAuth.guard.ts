// src/guards/jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { verifyToken } from 'src/utils/jwt.utils';
// import { VerifyAccessToken } from 'src/utils/verifyToken.utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split("Bearer ")[1];
    if (!token) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: 'Authorization token is missing',
        error: 'Unauthorized',
      });
    }

   
   const user=verifyToken(token)
  
    if (!user) {
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
