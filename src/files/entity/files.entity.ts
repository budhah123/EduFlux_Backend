import { ApiProperty } from '@nestjs/swagger';
import { CommonAttribute } from 'src/common/attribute';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity('files')
export class FileEntity extends CommonAttribute {
  @ApiProperty({
    description: 'The unique identifier of the file',
    type: ObjectId,
    example: '64b8c9f1e4b0a2d3c4e5f678',
  })
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiProperty({
    description: 'The name of the file',
    type: String,
    example: 'assignment1.pdf',
  })
  @Column('varchar', { name: 'filename' })
  filename: string;

  @ApiProperty({
    description: 'The title of the file',
    type: String,
    example: 'Assignment 1',
  })
  @Column('varchar', { name: 'title' })
  title: string;

  @ApiProperty({
    description: 'The description of the file',
    type: String,
    example: 'This is the first assignment.',
  })
  @Column('varchar', { name: 'description', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'The URL of the file',
    type: String,
    example: 'https://example.com/files/assignment1.pdf',
  })
  @Column('varchar', { name: 'fileUrl' })
  fileUrl: string;
}
