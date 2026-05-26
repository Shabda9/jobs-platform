import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { AUTH_MESSAGES } from './auth.messages';
import type { SupabaseJwtPayload } from './types/auth-request';

@Injectable()
export class SupabaseJwtService {
  private readonly jwtSecret: string;

  constructor(private readonly configService: ConfigService) {
    const secret = this.configService.get<string>('SUPABASE_JWT_SECRET');
    if (!secret?.trim()) {
      throw new InternalServerErrorException(
        'SUPABASE_JWT_SECRET is not configured on the API server.',
      );
    }
    this.jwtSecret = secret;
  }

  verifyAccessToken(token: string): SupabaseJwtPayload {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as SupabaseJwtPayload;

      if (!payload.sub) {
        throw new UnauthorizedException(AUTH_MESSAGES.invalidToken);
      }

      return payload;
    } catch {
      throw new UnauthorizedException(AUTH_MESSAGES.invalidToken);
    }
  }

  extractBearerToken(authorizationHeader: string | undefined): string {
    if (!authorizationHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(AUTH_MESSAGES.missingToken);
    }

    const token = authorizationHeader.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException(AUTH_MESSAGES.missingToken);
    }

    return token;
  }
}
