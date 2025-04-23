import { Module } from '@nestjs/common';
import { adminController } from './admin.controller';
import { adminService } from '../application/admin.service';
import { EnvironmentModule } from '@marketplace/config';

@Module({
  imports: [
    EnvironmentModule
  ],
  controllers: [adminController],
  providers: [adminService],
})
export class adminModule {} 
