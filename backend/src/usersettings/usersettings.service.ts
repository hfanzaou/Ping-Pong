import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createWriteStream, writeFileSync } from 'fs';
import path from 'path';
import { InstanceLoader } from '@nestjs/core/injector/instance-loader';

@Injectable()
export class UsersettingsService {
    constructor(private prisma: PrismaService) {}

    // async validateUser(id: number)
    // {
    //     const user = await this.prisma.user.findUnique({
    //         where: {
    //             id: id,
    //         }
    //     })
    //     if (!user)
    //         throw new NotFoundException('USER NOT FOUND');
    //     return user;
    // }
    async updateUsername(user: any, newName: string) {
        //const userdb = await this.validateUser(user.id);
        try {
            const userFind = await this.prisma.user.findUnique({
                where: {
                    username: newName,
                }, select: {
                    username: true,
                }
            });
            if (userFind && userFind.username === newName)
                throw new ConflictException('username already taken');
            await this.prisma.user.update({
                where: {
                    id: user.id
                }, data: {
                    username: newName,
                }
            })
        } catch(error) {
            throw  error instanceof ConflictException ? error : HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return true;
    }
    async updateAvater(id: number, avatar: string) {
        try {
            const base64Data = avatar.replace(/^data:image\/png;base64,/,"");
            const binaryData = Buffer.from(base64Data, 'base64').toString('binary');
            const path = "./uploads/avatar/" + id.toString() + '.png';
            const writestream = createWriteStream(path, 'binary');
            writestream.write(binaryData);
            await this.prisma.user.update({
                where: {
                    id: id,
                }, data: {
                    avatar: path,
                    upAvatar: true,
                }
            })
        } catch (error) {
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
}