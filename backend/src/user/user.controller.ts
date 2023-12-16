import { Controller, Get, UseGuards, Req, Query, Post, Body, HttpCode } from '@nestjs/common';
import { GetUser } from '../auth/decorator'
import { FTAuthGuard, JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import JwtTwoFaGuard from 'src/auth/guard/twoFaAuth.guard';

@UseGuards(JwtTwoFaGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService )
    {
    }
    @Get('avatar')
    async getImage(@Req() req) {
        ////console.log(req.user.id)
        return  {avatar: await this.userService.getUserAvatar(req.user.id)};
    }
    @Get('name')
    async getName(@Req() req) {
        const user = await this.userService.getProfileById(req.user.id)
        return ({name: user.username});
    }
    @Get('userid')
    async getProfileById(@Req() req, @Query('id') id: string) {
        //console.log('-------------------------------');
        ////console.log(intId);
        const userId: number = +id;
        return (this.userService.getProfileById(userId));
    }
    @Get('profile')
    async getProfile(@Req()  req) {
        //console.log(req.user.id)
        return (await this.userService.getProfile(req.user.id));
    }
    @Get('2fa')
    async getTwoFaState(@Req() req) {
        //console.log('in 2fa state');
        return (await this.userService.getTwoFaState(req.user.id));
    }
    @Get('list')
    async getUsersList(@Req() req) {
        return (await this.userService.getUsersList(req.user.id));
    }
    @Post('acceptfriend')
    @HttpCode(201)
    async acceptFriend(@Req() req, @Body() name: string) {
        return (await this.userService.acceptFriend(req.user.id, name));
    }
}
