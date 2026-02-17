import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentEntity } from './entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/files';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity]), FilesModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
