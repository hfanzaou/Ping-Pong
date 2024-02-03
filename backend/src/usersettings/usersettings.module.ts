import { Module } from '@nestjs/common';
import { UsersettingsController } from './usersettings.controller';
import { UsersettingsService } from './usersettings.service';
import { MulterModule } from '@nestjs/platform-express';
import { ChatService } from 'src/chat/chat.service';
import { ChatModule } from 'src/chat/Chat.module';

@Module({
  imports: [MulterModule.register({
    dest: './uploads/avatar',
  }), ChatModule],
  controllers: [UsersettingsController],
  providers: [UsersettingsService],
})
export class UsersettingsModule {}
