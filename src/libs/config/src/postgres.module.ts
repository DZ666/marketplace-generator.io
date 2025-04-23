import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class PostgresModule {
  static forRoot(entities = [], migrations = []): DynamicModule {
    return {
      module: PostgresModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            const url = configService.get<string>('DATABASE_URL');
            if (url) {
              return {
                type: 'postgres',
                url,
                entities,
                migrations,
                synchronize: true, // В проде лучше false
                autoLoadEntities: true,
              } as TypeOrmModuleOptions;
            }
            return {
              type: 'postgres',
              host: configService.get<string>('DATABASE_HOST'),
              port: configService.get<number>('DATABASE_PORT'),
              username: configService.get<string>('DATABASE_USER'),
              password: configService.get<string>('DATABASE_PASSWORD'),
              database: configService.get<string>('DATABASE_NAME'),
              entities,
              migrations,
              synchronize: true, // В проде лучше false
              autoLoadEntities: true,
            } as TypeOrmModuleOptions;
          },
          inject: [ConfigService],
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
} 