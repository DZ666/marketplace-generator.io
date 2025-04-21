import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentModule } from '../src/environment/environment.module';
import { environmentSchema } from '../src/environment/environment.schema';

describe('Environment Module', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EnvironmentModule],
    }).compile();

    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it('должен загружать значения по умолчанию', () => {
    expect(configService.get('NODE_ENV')).toBeDefined();
    expect(configService.get('PORT')).toBeDefined();
  });

  it('должен иметь правильную валидационную схему', () => {
    // Проверяем корректную валидацию
    const validEnv = {
      NODE_ENV: 'development',
      PORT: 3000,
      AUTH_PORT: 3000,
      USER_PORT: 3001,
      PRODUCT_PORT: 3002,
      ORDER_PORT: 3003,
      RABBITMQ_URL: 'amqp://user:password@localhost:5672',
    };

    const { error: validationError } = environmentSchema.validate(validEnv);
    expect(validationError).toBeUndefined();
  });

  it('должен отклонять неверные значения', () => {
    // Проверяем что схема отклоняет неверное значение NODE_ENV
    const invalidEnv = {
      NODE_ENV: 'invalid-env',
      PORT: 3000,
    };

    const { error: validationError } = environmentSchema.validate(invalidEnv);
    expect(validationError).toBeDefined();
  });

  describe('загрузка .env файлов', () => {
    it('должен загружать переменные из .env.dev в development режиме', async () => {
      process.env.NODE_ENV = 'development';
      
      const moduleRef = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            validationSchema: environmentSchema,
            envFilePath: ['.env.dev'],
          }),
        ],
      }).compile();

      const devConfigService = moduleRef.get<ConfigService>(ConfigService);
      
      // Проверяем значения из .env.dev (значения преобразуются в числа)
      expect(devConfigService.get('AUTH_PORT')).toBe(3000);
      expect(devConfigService.get('USER_PORT')).toBe(3001);
      expect(devConfigService.get('PRODUCT_PORT')).toBe(3002);
    });
  });
}); 