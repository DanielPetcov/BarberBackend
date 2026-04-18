import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'pino-nestjs';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.log(errors);
        return new BadRequestException(errors);
      },
    }),
  );
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
