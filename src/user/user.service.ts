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
        return avatar;
    }
    async getProfile(id: number) {
        let user = await this.prismaservice.user.findUnique({
            where: {
                id: id
            }
        })
        //console.log(user);
        return user;
    }
    async getProfileById(id: number) {
        try {
            let user = await this.prismaservice.user.findUnique({
                where: {
                    id: id
                }
            })
            return (user);
        } catch (error) {
            throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
        }
    }
}
