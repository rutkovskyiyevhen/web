import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './common/configs/env.config';
import * as cookieParser from 'cookie-parser';
global.crypto = require('crypto');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: '*',
  });
  
  await app.listen(config.port);
}
bootstrap();
