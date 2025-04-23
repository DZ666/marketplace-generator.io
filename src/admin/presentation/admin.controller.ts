import { Controller, Get } from '@nestjs/common';
import { adminService } from '../application/admin.service';

@Controller('admin')
export class adminController {
  constructor(private readonly adminService: adminService) {}

  @Get()
  getHello(): string {
    return this.adminService.getHello();
  }
}
