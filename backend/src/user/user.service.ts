import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
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
                const file = createReadStream(avatar.avatar, 'binary');
                //const read = file.read();
                return "data:image/png;base64,"+file;
            }
            return avatar;
        } catch(error) { 
            throw new InternalServerErrorException('Error fetching avatar');
        }
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
