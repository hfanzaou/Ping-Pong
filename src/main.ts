import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import CorsModule from '@nestjs/platform-express';
// import * as cors from 'cors';
const cors = require('cors');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
	new ValidationPipe({
  		whitelist: true,
  	}),
  );
  app.use(cors({
    origin: 'http://localhost:3001/', 
    credentials: true, 
  }));
  // app.enableCors()''
  // {
  //   origin: 
  // }
 // );
  await app.listen(3000);
}
bootstrap();
