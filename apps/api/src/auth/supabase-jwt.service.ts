import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { AUTH_MESSAGES } from './auth.messages';
import type { SupabaseJwtPayload } from './types/auth-request';

@Injectable()
export class SupabaseJwtService {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;
  private readonly jwtIssuer: string;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.normalizeSupabaseUrl(
      this.configService.get<string>('SUPABASE_URL'),
    );

    if (!supabaseUrl) {
      throw new InternalServerErrorException(
        'SUPABASE_URL must be set in apps/api/.env for JWT verification.',
      );
    }

    // Supabase issues modern access tokens signed with ES256/RS256.
    // We verify them using the public JWKS endpoint for the project.
    this.jwtIssuer = `${supabaseUrl}/auth/v1`;
    this.jwks = createRemoteJWKSet(
      new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`),
    );
  }

  /** Verify a Supabase access token and return the auth user id + email. */
  async verifyAccessToken(token: string): Promise<SupabaseJwtPayload> {
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.jwtIssuer,
      });
      return this.toSupabasePayload(payload);
    } catch {
      throw new UnauthorizedException(AUTH_MESSAGES.invalidToken);
    }
  }

  /** Read the Bearer token from the Authorization header. */
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

  private normalizeSupabaseUrl(value: string | undefined): string | null {
    const trimmed = value?.trim().replace(/\/$/, '');
    return trimmed ? trimmed : null;
  }

  private toSupabasePayload(payload: JWTPayload): SupabaseJwtPayload {
    if (!payload.sub) {
      throw new UnauthorizedException(AUTH_MESSAGES.invalidToken);
    }

    return {
      sub: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : undefined,
    };
  }
}
