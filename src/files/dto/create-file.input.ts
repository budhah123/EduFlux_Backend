import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFileInput {
  @ApiProperty({
    description: 'Title of the file',
    type: String,
    example: 'Assignment 1',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the file',
    type: String,
    example: 'This is the first assignment.',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
