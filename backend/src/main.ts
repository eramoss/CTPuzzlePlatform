import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.BACKEND_PREFIX) {
    app.setGlobalPrefix(process.env.BACKEND_PREFIX);
  }
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const origin = process.env.NODE_ENV === 'development' ? '*' : process.env.SITE_URL;
  console.log('CORS origin: ', origin);
  app.enableCors(
    {
      origin: origin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
      optionsSuccessStatus: 204,
    }
  )
  const port = process.env.BACKEND_PORT;
  console.log('Started backend at port ' + port);
  await app.listen(port);
}
bootstrap();
