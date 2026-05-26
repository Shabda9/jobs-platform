import { Global, Module } from '@nestjs/common';
import { SupabaseJwtService } from './supabase-jwt.service';
import { AppUserGuard } from './guards/app-user.guard';
import { EmployerRoleGuard } from './guards/employer-role.guard';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

@Global()
@Module({
  providers: [
    SupabaseJwtService,
    SupabaseAuthGuard,
    AppUserGuard,
    EmployerRoleGuard,
  ],
  exports: [
    SupabaseJwtService,
    SupabaseAuthGuard,
    AppUserGuard,
    EmployerRoleGuard,
  ],
})
export class AuthModule {}
