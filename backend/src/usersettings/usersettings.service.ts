import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createWriteStream, writeFileSync } from 'fs';
import path from 'path';
import { InstanceLoader } from '@nestjs/core/injector/instance-loader';

@Injectable()
export class UsersettingsService {
    constructor(private prisma: PrismaService) {}

    async updateUsername(user: any, newName: string) {
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
    async updateAvater(id: number, path: string) {
        try {
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