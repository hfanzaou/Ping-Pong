import { Module } from '@nestjs/common';
import { UsersettingsController } from './usersettings.controller';
import { UsersettingsService } from './usersettings.service';

@Module({
  controllers: [UsersettingsController],
  providers: [UsersettingsService]
})
export class UsersettingsModule {}
