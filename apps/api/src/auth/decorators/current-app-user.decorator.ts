import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import type { AppUser } from '@prisma/client';
import type { AuthenticatedRequest } from '../types/auth-request';

export const CurrentAppUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AppUser => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    // Should be set by AppUserGuard; if missing, middleware/guard ordering is wrong.
    if (!request.appUser) {
      throw new InternalServerErrorException(
        'AppUser is missing from the request. Ensure AppUserGuard runs before this route.',
      );
    }
    return request.appUser;
  },
);
