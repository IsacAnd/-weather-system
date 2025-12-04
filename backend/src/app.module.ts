import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherModule } from './weather/weather.module';
import { UsersModule } from './users/users.module';
import { HealthController } from './health.controller';
import { ExportModule } from './export/export.module';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { DeepSeekModule } from './ai/deepseek.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const user = config.get('MONGO_INITDB_ROOT_USERNAME');
        const pass = config.get('MONGO_INITDB_ROOT_PASSWORD');
        const host = config.get('MONGO_HOST');
        const port = config.get('MONGO_PORT');
        const db = config.get('MONGO_DB');
        console.log(user, pass)

        const authPart = user && pass ? `${user}:${pass}@` : '';

        return {
          uri: `mongodb://${authPart}${host}:${port}/${db}?authSource=admin`,
        };
      },
      inject: [ConfigService],
    }),

    WeatherModule,
    UsersModule,
    ExportModule,
    AuthModule,
    DeepSeekModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    private config: ConfigService,
  ) { }

  async onModuleInit() {
    await this.usersService.createIfNotExists(
      this.config.get('DEFAULT_ADMIN_EMAIL'),
      this.config.get('DEFAULT_ADMIN_PASSWORD'),
      'Admin',
      true,
    );
  }
}