import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { assertServiceRoleKey } from './supabase-key.utils';

/**
 * Server-side Supabase client using the service role key.
 * Never expose this client or key to the frontend.
 */
@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private adminClient: SupabaseClient | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    try {
      this.resolveServiceRoleKey();
      this.logger.log('Supabase service role key loaded for storage');
    } catch (error) {
      this.logger.warn(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  getAdminClient(): SupabaseClient {
    if (this.adminClient) {
      return this.adminClient;
    }

    const url = this.configService.get<string>('SUPABASE_URL')?.trim();
    const serviceRoleKey = this.resolveServiceRoleKey();

    if (!url) {
      throw new Error('SUPABASE_URL must be set for storage operations');
    }

    this.adminClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    return this.adminClient;
  }

  private resolveServiceRoleKey(): string {
    const serviceRoleKey = this.configService
      .get<string>('SUPABASE_SERVICE_ROLE_KEY')
      ?.trim();

    if (!serviceRoleKey) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY must be set in apps/api/.env for storage operations',
      );
    }

    assertServiceRoleKey(serviceRoleKey, 'SUPABASE_SERVICE_ROLE_KEY');
    return serviceRoleKey;
  }
}
