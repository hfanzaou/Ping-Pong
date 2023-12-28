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
    ///USER_INFO////
    @Get('avatar')
    async getImage(@Req() req) {
        ////console.log(req.user.id)
        return  {avatar: await this.userService.getUserAvatar(req.user.id)};
    }
    @Get('name')
    async getName(@Req() req) {
        const name = await this.userService.getUsername(req.user.id)
        return ({name: name});
    }
    // @Get('userid')
    // async getProfileById(@Req() req, @Query('id') id: string) {
    //     //console.log('-------------------------------');
    //     ////console.log(intId);
    //     const userId: number = +id;
    //     return (this.userService.getProfileById(userId));
    // }

    ///lists (friend, users ...) /////
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
    @Get('blocked')
    async getBlocks(@Req() req) {
        return (await this.userService.getBlocks(req.user.id));
    }
    ///ADD, ACCEPT AND BLOCK////
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
    @Post('block')
    @HttpCode(201)
    async blockUser(@Req() req, @Body() body) {
        return (await this.userService.blockUser(req.user.id, body.name));
    }
    @Post('inblock')
    @HttpCode(201)
    async inblockUser(@Req() req, @Body() body)
    {
        return (await this.userService.inblockUser(req.user.id, body.name));
    }
    //////ADD_ACHIEVEMENTS, GET_ACHIEVEMENTS///////
    @Post('achievements')
    @HttpCode(201)
    async addAchievement(@Req() req, @Body() body) {
        return (await this.userService.addAchievement(req.user.id, body.achievement));
    }
    @Get('achievements')
    async getAchievements(@Req() req) {
        return (await this.userService.getAchievements(req.user.id));
    }
    ///2FA_STATE///
    @Get('2fa')
    async getTwoFaState(@Req() req) {
        //console.log('in 2fa state');
        return (await this.userService.getTwoFaState(req.user.id));
    }
    @Get('matchhistory')
    async getMatchHistory(@Req() req) {
        return (await this.userService.getMatchHistory(req.user.id));
    }
    // @Post('matchhistory')
    // async addMatchHistoy(@Req() req, @Body() body) {
    //     return (await this.userService.addMatchHistory(req.user.id, body.username));
    // }
}
