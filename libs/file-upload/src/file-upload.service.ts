import { Inject, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ConfigType } from '@nestjs/config';
import uploadConfig from './config/upload.config';

@Injectable()
export class FileUploadService {
  private supabase: SupabaseClient;
  constructor(
    @Inject(uploadConfig.KEY)
    private readonly config: ConfigType<typeof uploadConfig>,
  ) {
    this.supabase = createClient(
      this.config.supabase.url,
      this.config.supabase.serviceRoleKey,
    );
  }

  async uploadFile(fileBuffer: Buffer, fileName: string) {
    const { data, error } = await this.supabase.storage
      .from(this.config.supabase.bucketName)
      .upload(fileName, fileBuffer);

    if (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async createSignedUrl(fileName: string, expiresIn = 3600) {
    const { data, error } = await this.supabase.storage
      .from(this.config.supabase.bucketName)
      .createSignedUrl(fileName, expiresIn);
    if (error) {
      throw new Error(`Creating signed URL failed: ${error.message}`);
    }
    return data.signedUrl;
  }
}
