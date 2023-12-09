import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaservice: PrismaService) {}

    async getUserAvatar(id: number) {
        let avatar = await this.prismaservice.user.findUnique({
            where: {
                id: id,
            }, select : {
                avatar: true,
            }
        })
        if (!avatar)
            throw new NotFoundException('USER NOT FOUND');
        return avatar;
    }
    async getProfile(id: number) {
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
    }
    async getProfileById(id: number) {
       
        console.log('console is in profilebyid');
        console.log(id);
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
    }
}
