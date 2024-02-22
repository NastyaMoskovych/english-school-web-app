import { RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getAllowedOrigins } from './guards/cors/cors.guard';
import { ConfigEnum } from './shared/models';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const origin = getAllowedOrigins(configService);
  const port = configService.get(ConfigEnum.PORT) || 3001;

  app.enableCors({ origin });
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  await app.listen(port);
}
bootstrap();
