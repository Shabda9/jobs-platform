import type { Request } from 'express';
import type { AppUser } from '@prisma/client';

export interface SupabaseJwtPayload {
  sub: string;
  email?: string;
}

export interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseJwtPayload;
  appUser?: AppUser;
}
