import { Injectable } from '@nestjs/common';

@Injectable()
export class adminService {
  constructor(
    // Здесь можно добавить внедрение зависимостей
  ) {}

  getHello(): string {
    return 'Hello from admin Service!';
  }
  
  processEvent(data: any): any {
    console.log('Processing event:', data);
    return { processed: true, data };
  }
}
