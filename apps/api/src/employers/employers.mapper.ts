import type { AppUser, EmployerProfile } from '@prisma/client';

export interface EmployerMeResponse {
  id: string;
  email: string;
  role: string;
  hasCompanyProfile: boolean;
}

type AppUserWithProfile = AppUser & {
  employerProfile: EmployerProfile | null;
};

/** Map a Prisma AppUser to the employer profile API response. */
export function toEmployerMeResponse(
  appUser: AppUserWithProfile,
): EmployerMeResponse {
  return {
    id: appUser.id,
    email: appUser.email,
    role: appUser.role,
    hasCompanyProfile: appUser.employerProfile != null,
  };
}
