import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AppUser } from '@prisma/client';
import type { AuthenticatedRequest } from '../types/auth-request';

export const CurrentAppUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AppUser => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.appUser!;
  },
);
