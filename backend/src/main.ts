import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import CorsModule from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '@nestjs/config';
const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
	new ValidationPipe({
  		whitelist: true,
  	}),
  );
  const config = app.get(ConfigService);
  app.use(cookieParser());
  app.use(cors({
    origin: [config.get('HOST'), config.get('LOCAL')], 
    credentials: true,
  }));
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3001);
}
bootstrap();
