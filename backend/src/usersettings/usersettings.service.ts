import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createWriteStream, writeFileSync } from 'fs';
import path from 'path';

@Injectable()
export class UsersettingsService {
    constructor(private prisma: PrismaService) {}

    async validateUser(id: number)
    {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            }
        })
        if (!user)
            throw new NotFoundException('USER NOT FOUND');
        return user;
    }
    async updateUsername(user: any, newName: string) {
        //const userdb = await this.validateUser(user.id);
        const userFind = await this.prisma.user.findUnique({
            where: {
                username: newName,
            }, select: {
                username: true,
            }
        });
        if (userFind && userFind.username === newName)
            throw new ConflictException('username already taken');
        try {
            await this.prisma.user.update({
                where: {
                    id: user.id
                }, data: {
                    username: newName,
                }
            })
        } catch(error) {
            throw new InternalServerErrorException('could not update the user');
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
            console.log(error);
            throw new InternalServerErrorException('Error uploading avatar');
        }
    }
}
