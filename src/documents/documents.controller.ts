import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { FileUploadService } from '@app/file-upload';
import { FilterDocumentDto } from './dto/filter-document.dto';
import {
  CreateDocumentInput,
  UpdateDocumentInput,
  UploadDocumentInput,
} from './dto';
import { AtGuard, AdminAtGuard } from '../auth/decorator';

const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/rtf',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/vnd.oasis.opendocument.presentation',
  'text/plain',
]);

const isAllowedUploadMimeType = (mimeType: string) =>
  mimeType.startsWith('image/') || ALLOWED_UPLOAD_MIME_TYPES.has(mimeType);

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(
    private documentsService: DocumentsService,
    private uploadService: FileUploadService,
  ) { }

  // PUBLIC
  @Get()
  @ApiOperation({ summary: 'Browse all published documents' })
  findAll(@Query() filter: FilterDocumentDto) {
    return this.documentsService.findAll(filter);
  }

  // PROTECTED — named sub-routes must come BEFORE :id param routes
  @Get('user/my-uploads')
  @AtGuard()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get my uploaded documents' })
  myUploads(@Query() filter: FilterDocumentDto, @Req() req) {
    return this.documentsService.findMyUploads(req.user.id, filter);
  }

  // ADMIN — named sub-routes must come BEFORE :id param routes
  @Get('admin/all')
  @AdminAtGuard()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Admin: get all documents any status' })
  adminAll(@Query() filter: FilterDocumentDto) {
    return this.documentsService.adminFindAll(filter);
  }

  @Get(':id/download')
  @AtGuard()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get download URL + increment count' })
  async download(@Param('id') id: string) {
    const doc = await this.documentsService.findById(id);
    await this.documentsService.incrementDownload(id);
    return { url: doc.fileUrl };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single document' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findById(id);
  }

  @Post('upload')
  @AtGuard()
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadDocumentInput })
  @ApiOperation({ summary: 'Upload document file' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        isAllowedUploadMimeType(file.mimetype)
          ? cb(null, true)
          : cb(
            new Error('Only documents, PDFs, and images are allowed'),
            false,
          );
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateDocumentInput,
    @Req() req,
  ) {
    const { fileKey, fileUrl } = await this.uploadService.uploadFile(
      file.buffer,
      file.originalname,
      req.user.id,
    );
    return this.documentsService.create({
      ...body,
      fileKey,
      fileUrl,
      fileSize: file.size,
      userId: req.user.id,
    } as any);
  }

  @Patch(':id')
  @AtGuard()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update document metadata' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentInput,
    @Req() req,
  ) {
    return this.documentsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @AtGuard()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete document' })
  delete(@Param('id') id: string, @Req() req) {
    return this.documentsService.delete(id, req.user.id);
  }

  @Patch(':id/status')
  @AdminAtGuard()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Admin: change document status' })
  changeStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.documentsService.changeStatus(id, status);
  }
}
