import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileInput } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationInput } from 'src/common/pagination';

@ApiTags('Files Management')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' }, // <-- file field
        title: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['file', 'title'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileInput: CreateFileInput,
  ) {
    const files = await this.filesService.uploadFile(file, createFileInput);
    return {
      message: 'File uploaded successfully',
      data: files,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all reasons' })
  @ApiOkResponse({
    description: 'Reasons retrieved successfully',
  })
  async getFiles(@Query() paginationInput: PaginationInput) {
    const [files, count] = await this.filesService.getFiles(
      {},
      {},
      paginationInput,
    );
    return {
      data: files,
      meta: {
        total: count,
        page: paginationInput?.page || 1,
        limit: paginationInput?.limit || 10,
      },
    };
  }
}
