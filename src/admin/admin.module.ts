import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { AdminUserController } from './user/admin-user.controller';
import { AdminAuthController } from './auth/admin-auth.controller';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AdminUserController, AdminAuthController],
  providers: [AdminService],
})
export class AdminModule {}
