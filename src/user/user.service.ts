import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaservice: PrismaService)
    {}
    async getUserById(id: number)
    {
        let finduser = await this.prismaservice.user.findUnique({
            where: {
                id: id,
            }, select : {
                avatar: true,
            }
        })
        return finduser;
    }
}
