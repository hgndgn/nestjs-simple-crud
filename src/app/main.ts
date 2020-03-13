import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { config } from '@config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(config.app.port);

  console.log(
    `***\n\tApplication is running on: ${config.app.host}:${config.app.port}\n***`,
  );
}
bootstrap();
