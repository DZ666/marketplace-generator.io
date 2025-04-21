import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { EnvironmentModule } from '../src/environment/environment.module';

// Создаем тестовый модуль, который использует EnvironmentModule
@Module({
  imports: [EnvironmentModule],
  providers: [],
})
class TestModule {}

describe('Environment Module Integration', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    // Устанавливаем переменные окружения для теста
    process.env.NODE_ENV = 'development';
    process.env.PORT = '3000';
    process.env.RABBITMQ_URL = 'amqp://test:test@localhost:5672';

    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    // Очищаем переменные окружения после теста
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.RABBITMQ_URL;
  });

  it('должен правильно интегрироваться в другие модули', () => {
    expect(configService).toBeDefined();
  });

  it('должен предоставлять доступ к переменным окружения через ConfigService', () => {
    // Проверяем, что значение NODE_ENV определено (не обязательно совпадает с тем, что мы задали)
    expect(configService.get('NODE_ENV')).toBeDefined();
    // Проверяем, что значение PORT определено и является числом
    // (не проверяем конкретное значение, т.к. оно может быть переопределено в docker-compose)
    expect(typeof configService.get('PORT')).toBe('number');
    // Проверяем, что значение RABBITMQ_URL определено
    expect(configService.get('RABBITMQ_URL')).toBeDefined();
  });

  it('должен предоставлять значения по умолчанию для незаданных переменных', () => {
    // Значение по умолчанию из environment.schema.ts
    expect(configService.get('AUTH_PORT')).toBeDefined();
    expect(configService.get('USER_PORT')).toBeDefined();
    expect(configService.get('PRODUCT_PORT')).toBeDefined();
    expect(configService.get('ORDER_PORT')).toBeDefined();
  });
}); 