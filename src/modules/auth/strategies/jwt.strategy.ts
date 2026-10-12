import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../../../config/app-config.service';
import { JwtPayload } from '../../../common/constants/app.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => {
          const auth = req?.headers?.authorization;
          if (!auth) return null;
          const parts = auth.split(' ');
          return parts.length > 1 ? parts[1] : parts[0];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload._id) {
      throw new UnauthorizedException('Unauthorized');
    }
    return {
      _id: payload._id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  }
}
