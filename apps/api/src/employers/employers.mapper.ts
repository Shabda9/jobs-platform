import type { AppUser } from '@prisma/client';

export interface EmployerMeResponse {
  id: string;
  email: string;
  role: string;
  hasCompanyProfile: boolean;
}

export function toEmployerMeResponse(
  appUser: AppUser,
  hasCompanyProfile: boolean,
): EmployerMeResponse {
  return {
    id: appUser.id,
    email: appUser.email,
    role: appUser.role,
    hasCompanyProfile,
  };
}
