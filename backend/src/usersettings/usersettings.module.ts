import { Module } from '@nestjs/common';
import { UsersettingsController } from './usersettings.controller';
import { UsersettingsService } from './usersettings.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({
    dest: './uploads/avatar',
  })],
  controllers: [UsersettingsController],
  providers: [UsersettingsService]
})
export class UsersettingsModule {}
