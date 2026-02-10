import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import supabaseConfig from './config/supabase.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;
  constructor(
    @Inject(supabaseConfig.KEY)
    private readonly config: ConfigType<typeof supabaseConfig>,
  ) {
    this.client = new SupabaseClient(this.config.url, this.config.serviceKey);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
