import { Controller, UseFilters, UseGuards, Req, Post, Body, HttpCode } from '@nestjs/common';
import JwtTwoFaGuard from 'src/auth/guard/twoFaAuth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersettingsService } from './usersettings.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('settings')
@UseGuards(JwtTwoFaGuard)
export class UsersettingsController {
    constructor(private userSetService: UsersettingsService) {}

    @Post('name')
    @HttpCode(201)    
    editUsername(@Req() req, @Body() Name) {
        console.log('im in edit name');
        console.log(Name.uniqueName);
        this.userSetService.updateUsername(req.user, Name.uniqueName);   
    }

}
