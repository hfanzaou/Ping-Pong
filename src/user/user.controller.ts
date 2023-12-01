import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { GetUser } from '../auth/decorator'
import { FTAuthGuard, JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userservice: UserService )
    {
    }
    @Get('image')
    getMe(@Req() req) {
        console.log(req.user);
        return this.userservice.getUserById(req.user.userID);
    }
}
