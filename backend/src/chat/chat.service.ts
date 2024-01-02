import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { NEWCHAT, USERDATA, USERSOCKET } from "./myTypes";
import { Socket } from "socket.io"

@Injectable()
export class ChatService {
	private rooms: string[];

	constructor(private prisma: PrismaService) {
		this.rooms = [];
	}
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
			const data: USERDATA = {
				userName: user.username,
				chatUsers: user.chatUsers.map(x => ({
					id: x.id,
					login: x.username
				}))
			}
			return data;
		}
		else
			return null 
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
	getRoom(data: NEWCHAT) {
		const room = this.rooms.find(room => {
			if (room.indexOf(data.sender) == -1
				|| room.indexOf(data.recver) == -1)
				return false;
			else
				return true;
		});
		if (room)
			return room;
		else {
			this.rooms.push(data.sender+data.recver);
			return data.sender+data.recver;
		}
	}
}
