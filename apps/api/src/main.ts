import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  if (process.env.SWAGGER_ENABLED !== 'false') {
    const config = new DocumentBuilder()
      .setTitle(process.env.SWAGGER_TITLE || 'UzERP API')
      .setDescription(
        process.env.SWAGGER_DESCRIPTION ||
          'UzERP - Zamonaviy ERP/Buxgalteriya tizimi API',
      )
      .setVersion(process.env.SWAGGER_VERSION || '1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Auth', 'Autentifikatsiya')
      .addTag('Users', 'Foydalanuvchilar')
      .addTag('Organizations', 'Tashkilotlar')
      .addTag('Accounts', 'Hisoblar rejasi (BHMS)')
      .addTag('Journal', 'Buxgalteriya jurnali')
      .addTag('Transactions', 'Tranzaksiyalar')
      .addTag('Balance', 'Balans')
      .addTag('Counterparties', 'Kontragentlar')
      .addTag('Tax', 'Soliq hisobi')
      .addTag('VAT', 'QQS')
      .addTag('Employees', 'Xodimlar')
      .addTag('Payroll', 'Ish haqi')
      .addTag('Warehouse', 'Ombor')
      .addTag('Bank', 'Bank operatsiyalari')
      .addTag('Payments', 'Online to\'lovlar')
      .addTag('Reports', 'Hisobotlar')
      .addTag('Dashboard', 'Boshqaruv paneli')
      .addTag('Settings', 'Sozlamalar')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
    logger.log('Swagger documentation available at /api/docs');
  }

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  logger.log(`UzERP API running on port ${port}`);
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
