import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { MongoRepository } from 'typeorm';
import { FileEntity } from './entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadService } from '@app/file-upload';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: MongoRepository<FileEntity>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async uploadFile(file: Express.Multer.File, data: Partial<FileEntity>) {
    if (!file) {
      throw new Error('No file provided');
    }

    const timestamp = Date.now();
    const fileKey = `assignments/media/${timestamp}-${file.originalname}`;
    await this.fileUploadService.uploadFile(file.buffer, fileKey);

    const fileUrl = await this.fileUploadService.createSignedUrl(fileKey);
    const fileEntity = this.fileRepository.create({
      filename: file.originalname,
      title: data.title,
      description: data.description,
      fileUrl,
    });
    return this.fileRepository.save(fileEntity);
  }
}
