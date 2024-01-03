import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { MESSAGE, NEWCHAT, USERDATA, USERSOCKET } from "./myTypes";
import { Socket } from "socket.io"

@Injectable()
export class ChatService {
	private rooms: string[];

	constructor(private prisma: PrismaService) {
		this.rooms = [];
	}
	async getUserData(userSocket: USERSOCKET) {
		const	user = await this.prisma.user.findUnique({
			where: {
				username: userSocket.username,
				// state: "Offline"
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
	async addMessage(data: MESSAGE) {
		let	chatHistorie = await this.prisma.cHATHISTORY.findFirst({
			where: {
				AND: [
					{
						users: {
							some: {
								user: {
									username: data.sender
								}
							}
						}
					},
					{
						users: {
							some: {
								user: {
									username: data.recver
								}
							}
						}
					}
				]
			}
		})
		if (!chatHistorie) {
			chatHistorie = await this.prisma.cHATHISTORY.create({
				data: {
					users: {
						create: [
							{
								user: {
									connect: {
										username: data.sender
									}
								}
							},
							{
								user: {
									connect: {
										username: data.recver
									}
								}
							}
						]
					}
				}
			});
		}
		const message = await this.prisma.mESSAGE.create({
			data: {
				sender: data.sender,
				message: data.message,
				chathistory: {
					connect: {
						id: chatHistorie.id
					}
				}
			}
		});
		return {
			id: message.id,
			message: `${data.sender}   ${data.message}`
		}
	}
	async getUserHistory(data: NEWCHAT) {
		if (data.sender && data.recver) {
			const history = await this.prisma.cHATHISTORY.findFirst({
				where: {
					AND: [
						{
							users: {
								some: {
									user: {
										username: data.sender
									}
								}
							}
						},
						{
							users: {
								some: {
									user: {
										username: data.recver
									}
								}
							}
						}
					]
				},
				include: {
					messages: true
				}
			});
			if (history) {
				const chatHistory = [...history.messages.map(x => {
					return {
						id: x.id,
						message: `${x.sender}   ${x.message}`
					}
				})].reverse();
				return chatHistory;
			}
			else
				return null;
		}
		return null;
	}
}
