import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiModule } from './presentation';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, {
    cors: {
      origin: [/127.0.0.1|localhost/],
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
    },
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NewAnigram Swagger')
    .setVersion('1.0')
    .setDescription('NewAnigram internal API')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, swaggerDocument);

  // versioning for API
  app.setGlobalPrefix('/v1');

  await app.listen(3000, () => {
    console.info(`
API url: http://127.0.0.1:3000,
Swagger url: http://127.0.0.1:3000/doc,
    `);
  });
}
bootstrap();
