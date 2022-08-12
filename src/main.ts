import { NestFactory } from '@nestjs/core';
import { ApiModule } from './presentation';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, {
    cors: {
      origin: [/127.0.0.1|localhost/],
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
    },
  });

  // versioning for API
  app.setGlobalPrefix('/v1');

  await app.listen(3000);
}
bootstrap();
