import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import uploadConfig from './config/upload.config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class FileUploadService {
  constructor(
    @Inject(uploadConfig.KEY)
    private readonly config: ConfigType<typeof uploadConfig>,
  ) {
    cloudinary.config({
      cloud_name: this.config.cloudinary.cloudName,
      api_key: this.config.cloudinary.apiKey,
      api_secret: this.config.cloudinary.apiSecret,
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    userId: string,
  ): Promise<{ fileKey: string; fileUrl: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `${this.config.cloudinary.folder}/${userId}`,
          resource_type: 'raw',
          public_id: `${Date.now()}-${fileName.replace(/\s+/g, '_')}`,
        },
        (error, result: UploadApiResponse) => {
          if (error)
            return reject(new Error(`File upload failed: ${error.message}`));
          resolve({
            fileKey: result.public_id, // save in MongoDB
            fileUrl: result.secure_url, // save in MongoDB
          });
        },
      );
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  async deleteFile(fileKey: string): Promise<void> {
    const { result } = await cloudinary.uploader.destroy(fileKey, {
      resource_type: 'raw',
    });
    if (result !== 'ok') {
      throw new Error(`File deletion failed: ${fileKey}`);
    }
  }

  async createSignedUrl(fileKey: string, expiresIn = 3600): Promise<string> {
    const signedUrl = cloudinary.utils.private_download_url(fileKey, 'pdf', {
      resource_type: 'raw',
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    });
    if (!signedUrl) {
      throw new Error(`Creating signed URL failed:${fileKey}`);
    }
    return signedUrl;
  }
}
