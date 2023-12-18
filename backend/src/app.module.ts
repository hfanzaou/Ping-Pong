import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module'; 
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UsersettingsModule } from './usersettings/usersettings.module';
import { GatewayController } from './gateway/gateway.controller';
import { GatewayService } from './gateway/gateway.service';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
            ConfigModule.forRoot({
              isGlobal: true,
            }),
            AuthModule,
            PrismaModule,
            UserModule,
            UsersettingsModule,
            GatewayModule
          ],
})
export class AppModule {}
