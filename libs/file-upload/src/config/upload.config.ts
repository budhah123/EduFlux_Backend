import { registerAs } from '@nestjs/config';
import { UPLOAD_CONFIG_NAME } from '../constants';

export interface UploadConfig {
  supabase: {
    url: string;
    serviceRoleKey: string;
    bucketName: string;
  };
}

export default registerAs(
  UPLOAD_CONFIG_NAME,
  (): UploadConfig => ({
    supabase: {
      url: process.env.SUPABASE_URL || '',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',
      bucketName: process.env.SUPABASE_BUCKET_NAME || process.env.SUPABSE_BUCKET_NAME || '',
    },
  }),
);
