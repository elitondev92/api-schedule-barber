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
  // Defined Max Request Body Size to 500mb
  app.use(urlencoded({ limit: '500mb', extended: true }));
  app.use(json({ limit: '500mb' }));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  await app.listen(3000);
}
bootstrap();
