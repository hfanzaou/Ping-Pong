import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module'; 
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UsersettingsModule } from './usersettings/usersettings.module';
import { ChatModule } from './chat/Chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GameModule } from './game/game.module';

@Module({
  imports: [
            ConfigModule.forRoot({
              isGlobal: true,
            }),
            AuthModule,
            PrismaModule,
            UserModule,
            UsersettingsModule,
            ChatModule,
            GameModule,
          ],
})
export class AppModule {}
