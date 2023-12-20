import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}
	async getData() {
		const	users = await this.prisma.chatUser.findMany();
		return users.map(x => ({
			login:	x.login,
			id:		x.id
		}));
	}
}
