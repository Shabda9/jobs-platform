import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AUTH_MESSAGES } from '../auth/auth.messages';
import type { SupabaseJwtPayload } from '../auth/types/auth-request';
import { PrismaService } from '../prisma/prisma.service';
import {
  toEmployerMeResponse,
  type EmployerMeResponse,
} from './employers.mapper';

@Injectable()
export class EmployersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Create the AppUser row for a new Supabase auth user, or return the existing one. */
  async bootstrap(supabaseUser: SupabaseJwtPayload): Promise<EmployerMeResponse> {
    const email = this.requireEmail(supabaseUser);

    const existing = await this.prisma.appUser.findUnique({
      where: { supabaseAuthUserId: supabaseUser.sub },
      include: { employerProfile: true },
    });

    if (existing) {
      if (existing.role !== UserRole.EMPLOYER) {
        throw new ForbiddenException(AUTH_MESSAGES.notEmployer);
      }
      return toEmployerMeResponse(existing);
    }

    const emailTaken = await this.prisma.appUser.findUnique({
      where: { email },
    });

    if (emailTaken) {
      throw new ConflictException(AUTH_MESSAGES.emailInUse);
    }

    const created = await this.prisma.appUser.create({
      data: {
        supabaseAuthUserId: supabaseUser.sub,
        email,
        role: UserRole.EMPLOYER,
      },
      include: { employerProfile: true },
    });

    return toEmployerMeResponse(created);
  }

  /** Return the logged-in employer profile. Role is enforced by EmployerRoleGuard. */
  async getMe(appUserId: string): Promise<EmployerMeResponse> {
    const appUser = await this.prisma.appUser.findUnique({
      where: { id: appUserId },
      include: { employerProfile: true },
    });

    if (!appUser) {
      throw new UnauthorizedException(AUTH_MESSAGES.notProvisioned);
    }

    return toEmployerMeResponse(appUser);
  }

  private requireEmail(supabaseUser: SupabaseJwtPayload): string {
    const email = supabaseUser.email?.trim().toLowerCase();
    if (!email) {
      throw new UnauthorizedException(AUTH_MESSAGES.invalidToken);
    }
    return email;
  }
}
