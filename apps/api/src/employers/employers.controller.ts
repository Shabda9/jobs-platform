import {
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AUTH_MESSAGES } from '../auth/auth.messages';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import type { AuthenticatedRequest } from '../auth/types/auth-request';
import { EmployersService } from './employers.service';

@Controller('employers')
export class EmployersController {
  constructor(private readonly employersService: EmployersService) {}

  @Post('bootstrap')
  @UseGuards(SupabaseAuthGuard)
  async bootstrap(@Req() request: AuthenticatedRequest) {
    const supabaseUser = request.supabaseUser;
    if (!supabaseUser) {
      throw new InternalServerErrorException(
        'SupabaseAuthGuard did not attach supabaseUser to the request.',
      );
    }

    const profile = await this.employersService.bootstrap(supabaseUser);

    return {
      message: AUTH_MESSAGES.bootstrapSuccess,
      ...profile,
    };
  }
}
