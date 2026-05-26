import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SupabaseJwtService } from '../supabase-jwt.service';
import type { AuthenticatedRequest } from '../types/auth-request';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseJwtService: SupabaseJwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.supabaseJwtService.extractBearerToken(
      request.headers.authorization,
    );
    request.supabaseUser = this.supabaseJwtService.verifyAccessToken(token);
    return true;
  }
}
