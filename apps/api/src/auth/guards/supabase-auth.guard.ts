import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SupabaseJwtService } from '../supabase-jwt.service';
import type { AuthenticatedRequest } from '../types/auth-request';

/** Validates the Supabase JWT and attaches the auth identity to the request. */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseJwtService: SupabaseJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.supabaseJwtService.extractBearerToken(
      request.headers.authorization,
    );
    request.supabaseUser =
      await this.supabaseJwtService.verifyAccessToken(token);
    return true;
  }
}
