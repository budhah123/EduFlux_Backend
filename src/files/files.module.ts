import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entity';
import { FileUploadModule } from '@app/file-upload';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), FileUploadModule],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
