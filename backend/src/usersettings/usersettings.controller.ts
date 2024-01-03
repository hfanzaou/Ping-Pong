import { Controller, UseFilters, UseGuards, Req, Post, Body, HttpCode, UseInterceptors, UploadedFile, HttpStatus, ParseFilePipeBuilder, PayloadTooLargeException, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import JwtTwoFaGuard from 'src/auth/guard/twoFaAuth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersettingsService } from './usersettings.service';
import { JwtGuard } from 'src/auth/guard';
import { createWriteStream } from 'fs';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('settings')
@UseGuards(JwtTwoFaGuard)
export class UsersettingsController {
    constructor(private userSetService: UsersettingsService) {}


    @Post('name')
    @UseGuards(JwtTwoFaGuard)
    @HttpCode(201)    
    async editUsername(@Req() req, @Body() Name) {
        if (!Name.uniqueName)
          throw HttpStatus.BAD_REQUEST;
        await this.userSetService.updateUsername(req.user, Name.uniqueName);   
    }
    @Post('avatar')
    @UseGuards(JwtTwoFaGuard)
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('File'))
    async editAvatar(@Req() req, @UploadedFile(
        new ParseFilePipe({
            validators: [
              new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
              new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
            ],
          }),
    ) file: Express.Multer.File) {
        console.log(file);
      await this.userSetService.updateAvater(req.user.id, file.path);
    }
}
