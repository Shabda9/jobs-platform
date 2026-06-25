import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AUTH_MESSAGES } from '../auth.messages';
import type { AuthenticatedRequest } from '../types/auth-request';

/** Restricts access to employer AppUser records only. */
@Injectable()
export class EmployerRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (request.appUser?.role !== UserRole.EMPLOYER) {
      throw new ForbiddenException(AUTH_MESSAGES.notEmployer);
    }

    return true;
  }
}
