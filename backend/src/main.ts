import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const port = process.env.BACKEND_PORT
    console.log('Started backend at port ' + port)
    await app.listen(port);
}
bootstrap();
