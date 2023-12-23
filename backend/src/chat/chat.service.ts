import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { USERDATA, USERSOCKET } from "./myTypes";
import { Socket } from "socket.io"

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}
	async getUserData(userSocket: USERSOCKET) {
		const	user = await this.prisma.user.findFirst({
			where: {
				state: "Offline"
			},
			include: {
				chatUsers: true
			}
		});
		if (user) {
			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					state: "Online",
					socket: userSocket.socket
				}
			});
		}
		const data: USERDATA = {
			userName: user.username,
			chatUsers: user.chatUsers.map(x => ({
				id: x.id,
				login: x.username
			}))
		}
		return data;
	}
	async dropUser(client: Socket) {
		const	user = await this.prisma.user.findUnique({
			where: {
				socket: client.id
			}
		});
		if (user) {
			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					state: "Offline",
					socket: null
				}
			});
		}
	}
}
