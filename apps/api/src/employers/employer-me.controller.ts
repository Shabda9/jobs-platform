import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentAppUser } from '../auth/decorators/current-app-user.decorator';
import { AppUserGuard } from '../auth/guards/app-user.guard';
import { EmployerRoleGuard } from '../auth/guards/employer-role.guard';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import type { AppUser } from '@prisma/client';
import { EmployersService } from './employers.service';

@Controller('employer')
export class EmployerMeController {
  constructor(private readonly employersService: EmployersService) {}

  @Get('me')
  @UseGuards(SupabaseAuthGuard, AppUserGuard, EmployerRoleGuard)
  getMe(@CurrentAppUser() appUser: AppUser) {
    return this.employersService.getMe(appUser.id);
  }
}
