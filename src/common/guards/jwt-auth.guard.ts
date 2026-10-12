import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(err: unknown, user: TUser, info: unknown): TUser {
    if (err || !user) {
      if (
        info &&
        typeof info === 'object' &&
        'message' in info &&
        (info as { message: string }).message === 'No auth token'
      ) {
        throw new UnauthorizedException('Token is required');
      }
      if (err instanceof Error) {
        throw err;
      }
      throw new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
