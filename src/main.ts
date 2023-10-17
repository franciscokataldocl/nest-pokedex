import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  //esto es para transformar los valores de los DTO
  //EJEMPLO envio limit=100 por quuery params y eso seria un string
  //entonces nest transforma ese dto en NUMBER
transform: true,
transformOptions: {
  enableImplicitConversion: true,
}
})
  );

  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
