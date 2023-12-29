import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'
import { GameGateway } from './game/game.gateway';
import { RoomService } from './room/room.service';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'root'),
    }),
  ],
  providers: [GameGateway, RoomService],
  controllers: [],
})
export class AppModule {}
