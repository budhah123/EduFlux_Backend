import { PartialType } from '@nestjs/swagger';
import { CreateFileInput } from './create-file.input';

export class UpdateFileInput extends PartialType(CreateFileInput) {}
