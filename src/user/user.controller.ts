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
        const toFind: string = 'avatar';
        return this.userService.getUserAvatar(req.user.userID);
    }
    @Get('profile')
    getProfile(@Req()  req, @Query('id') id: number) {
        if (id !== 0)
           return (this.userService.getUserById(id));
        return (this.userService.getProfile(req.user.userID));
    }
}
