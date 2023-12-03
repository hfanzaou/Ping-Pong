import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { GetUser } from '../auth/decorator'
import { FTAuthGuard, JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService )
    {
    }
    @Get('image')
    getImage(@Req() req) {
        return this.userService.getUserAvatar(req.user.userID);
    }
    @Get('userid')
    getProfileByid(@Req() req, @Query('id') id: number) {
        return (this.userService.getProfileById(id));
    }
    @Get('profile')
    getProfile(@Req()  req) {
        return (this.userService.getProfile(req.user.userID));
    }
}
