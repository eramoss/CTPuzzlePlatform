import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.BACKEND_PREFIX);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors();
  const port = process.env.BACKEND_PORT;
  console.log('Started backend at port ' + port);
  await app.listen(port);
}
bootstrap();
