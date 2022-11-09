import 'reflect-metadata';
import 'es6-shim';
import { NestFactory } from '@nestjs/core';
import { Request, Response, urlencoded, json } from 'express';
import { AppModule } from './app.module';

import AppError from './errors/AppError';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((err: Error, request: Request, response: Response, _next: any) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }
  });
  // Defined Max Request Body Size to 50mb
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.use(json({ limit: '50mb' }));
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    methods: '*',
  });

  await app.listen(3000);
}
bootstrap();
