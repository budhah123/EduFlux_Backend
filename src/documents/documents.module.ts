import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entity';
import { FileUploadModule } from '@app/file-upload';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity]), FileUploadModule],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}
