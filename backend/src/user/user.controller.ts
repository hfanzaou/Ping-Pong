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
    @Get('friend/list')
    async getFriendsList(@Req() req) {
        return (await this.userService.getFriendsList(req.user.id));
    }
    @Get('friend/requests')
    async getFriendReq(@Req() req) {
        return (await this.userService.getFriendReq(req.user.id));
    }
    @Post('add/friend')
    @HttpCode(201)
    async addFriend(@Req() req, @Body() body) {
        await this.userService.addFriend(req.user.id, body.name);
    }
    @Post('accept/friend')
    @HttpCode(201)
    async acceptFriend(@Req() req, @Body() body) {
        return (await this.userService.acceptFriend(req.user.id, body.name));
    }
    @Post('achievements')
    @HttpCode(201)
    async addAchievement(@Req() req, @Body() body) {
        return (await this.userService.addAchievement(req.user.id, body.achievement))
    }
    @Post('block')
    @HttpCode(201)
    async blockUser(@Req() req, @Body() body) {
        return (await this.userService.blockUser(req.user.id, body.name));
    }
}
