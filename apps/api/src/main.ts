import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const appUrl = configService.get<string>('APP_URL', 'http://localhost:3000');

  app.enableCors({
    origin: appUrl,
    credentials: true,
  });

  await app.listen(port);
}

bootstrap();
