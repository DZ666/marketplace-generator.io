import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from '../application/analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getHello(): string {
    return this.analyticsService.getHello();
  }
}
