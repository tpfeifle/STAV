import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { FileLogger } from './logger/file-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Sensor Platform API')
    .setDescription('Lorem Ipsum')
    .setVersion('1.0')
    .addTag('Chart')
    .addTag('ScriptManager')
    .addTag('Sheet')
    .addTag('Cron')
    .addTag('ParserManager')
    .addTag('SensorTable')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.enableCors();

  await app.listen(3001);
}
bootstrap();
