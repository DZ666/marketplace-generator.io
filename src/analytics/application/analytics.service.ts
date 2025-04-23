import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  constructor(
    // Здесь можно добавить внедрение зависимостей
  ) {}

  getHello(): string {
    return 'Hello from Analytics Service!';
  }
  
  processEvent(data: any): any {
    console.log('Processing event:', data);
    return { processed: true, data };
  }
}
