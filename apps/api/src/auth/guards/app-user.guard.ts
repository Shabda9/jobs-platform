import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AUTH_MESSAGES } from '../auth.messages';
import type { AuthenticatedRequest } from '../types/auth-request';

@Injectable()
export class AppUserGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const supabaseUser = request.supabaseUser;

    if (!supabaseUser?.sub) {
      throw new UnauthorizedException(AUTH_MESSAGES.invalidToken);
    }

    const appUser = await this.prisma.appUser.findUnique({
      where: { supabaseAuthUserId: supabaseUser.sub },
    });

    if (!appUser) {
      throw new NotFoundException(AUTH_MESSAGES.notProvisioned);
    }

    request.appUser = appUser;
    return true;
  }
}
