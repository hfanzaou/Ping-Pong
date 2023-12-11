import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, StreamableFile } from '@nestjs/common';
import { createReadStream, readFileSync } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaservice: PrismaService) {}

    async getUserAvatar(id: number) {
        try {
            const avatar = await this.prismaservice.user.findUnique({
                where: {
                    id: id,
                }, select : {
                    avatar: true,
                    upAvatar: true,
                }
            })
            if (!avatar)
                throw new NotFoundException('USER NOT FOUND');
            if (avatar.upAvatar)
            {
                console.log(avatar.avatar);
                const file = readFileSync(avatar.avatar, 'base64');
                //console.log(file.toString('base64'));
                return "data:image/png;base64,"+ file.toString();
            }
            return avatar;
        } catch(error) {
            if (error instanceof NotFoundException)
                throw HttpStatus.NOT_FOUND; 
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    async getProfile(id: number) {
        try {
            let user = await this.prismaservice.user.findUnique({
                where: {
                    id: id
                }, select: {
                    username: true,
                    avatar: true,
                    firstName: true,
                    lastName: true,
                }
            })
            if (!user)
                throw new NotFoundException('USER NOT FOUND');
            //console.log(user);
            return user;
        } catch(error) {
            if (error instanceof NotFoundException)
                throw HttpStatus.NOT_FOUND;
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    async getProfileById(id: number) {
        try {
            const user = await this.prismaservice.user.findUnique({
                 where: {
                     id: id
                 }, select: {
                     username: true,
                     avatar: true,
                     firstName: true,
                     lastName: true,
                 }
             })
            if (!user)
                 throw new NotFoundException('USER NOT FOUND');
            return (user);
        } catch(error) {
            if (error instanceof NotFoundException)
                throw HttpStatus.NOT_FOUND;
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    async getTwoFaState(id: number)
    {
        try {
            const user = await this.prismaservice.user.findUnique({
                where: {
                    id: id
                }, select: {
                    twoFaAuth: true,
                }
            })
            return user.twoFaAuth;
        } catch(error) {
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
}
