import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // import เพิ่ม

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // รับ ConfigService เข้ามาใน Constructor
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // อ่านค่าจาก .env แทน Hardcode
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey', 
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}