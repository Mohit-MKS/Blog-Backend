import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(AppConfigService);

  // Large payload support
  app.use(json({ limit: '500mb' }));
  app.use(urlencoded({ limit: '500mb', extended: false }));

  // CORS matching original configuration
  app.enableCors({
    origin: (origin, callback) => {
      // Allow any origin or requests without origin (e.g. mobile apps, curl)
      callback(null, origin || true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Tokenuserid',
      'Appid',
      'refreshtoken',
      'app_key',
      'app_secret',
    ],
    exposedHeaders: ['tokens'],
    credentials: true,
  });

  // Global prefix for all API endpoints
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Global exception filter for consistent error formatting
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = configService.port;
  await app.listen(port);
  logger.log(`Server running on PORT: ${port}`);
}

bootstrap();
