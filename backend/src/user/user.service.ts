import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, StreamableFile } from '@nestjs/common';
import { createReadStream, readFileSync } from 'fs';
import { userDto } from 'src/auth/dto';
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
            if (!avatar || !avatar.avatar)
                return "";
            if (avatar.upAvatar)
            {
                ////console.log(avatar.avatar);
                const file = readFileSync(avatar.avatar, 'base64');
                ////console.log(file.toString('base64'));
                return ("data:image/png;base64,"+ file.toString());
            }
            return (avatar.avatar);
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
    async getUsersList(id: number) {
        console.log(id);
        try {
            const users = await this.prismaservice.user.findMany({
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    state: true
                }
            });
            console.log(users);
            const usersre: userDto[] = await Promise.all(users.filter((obj) => {
                if (obj.id != id) {
                    return true
                }
                return false;
              }).map(async (obj) => {
                const avatar = await this.getUserAvatar(obj.id);
                return { key: obj.id, name: obj.username, avatar: avatar, state: obj.state };
              })); 
              console.log(usersre);
            return usersre;
        } catch(error) {
            console.log(error);
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    // async checkBlocks(id: number, name: string) 
    // {

    // }
    // async addFriend(id: number, name:string) {
    //     try {
    //         const user = await this.prismaservice.user.findUnique
    //         const user = await this.prismaservice.user.findUnique({
    //             where: { 
    //                 username: name,
    //             }
    //         });
    //         await this.prismaservice.user.update({
    //             where: {id: id},
    //             data: {friends: {
    //                 connect: {id: user.id}
    //             }}
    //         })
    //         await this.prismaservice.user.update({
    //             where: {id: user.id},
    //             data: {friendOf: {
    //                 connect: {id: id}
    //             }}
    //         })
    //     } catch(error) {
    //         throw HttpStatus.INTERNAL_SERVER_ERROR;
    //     }
    // }

    async acceptFriend(id: number, name: string) {   
        try {
            const user = await this.prismaservice.user.findUnique({
                where: { 
                    username: name,
                }
            });
            await this.prismaservice.user.update({
                where: {id: id},
                data: {friends: {
                    connect: {id: user.id}
                }}
            })
            await this.prismaservice.user.update({
                where: {id: user.id},
                data: {friends: {
                    connect: {id: id}
                }}
            })
        } catch(error) {
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
}
