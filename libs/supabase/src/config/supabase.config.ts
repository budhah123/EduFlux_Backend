import { registerAs } from '@nestjs/config';
import { SUPABASE_CONFIG_NAME } from '../constants';

export interface ISupabaseConfig {
  url: string;
  serviceKey: string;
  schema: string;
}
export default registerAs(
  SUPABASE_CONFIG_NAME,
  (): ISupabaseConfig => ({
    url: process.env.SUPABASE_URL || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
    schema: process.env.SUPABASE_SCHEMA || 'public',
  }),
);
