import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { MESSAGE, NEWCHAT, USERDATA, USERSOCKET } from "./myTypes";
import { Socket } from "socket.io"
import { UserService } from "src/user/user.service";

@Injectable()
export class ChatService {
	private rooms: string[];

	constructor(private prisma: PrismaService, private user: UserService) {
		this.rooms = [];
	}
	async getUserData(userSocket: USERSOCKET) {
		const	user = await this.prisma.user.findUnique({
			where: { username: userSocket.username },
			include: {
				chatUsers: true,
				friends: true,
				friendOf: true
			}
		});
		if (user) {
			await this.prisma.user.update({
				where: { id: user.id },
				data: {
					state: "Online",
					socket: userSocket.socket
				}
			});
			const data: USERDATA = {
				userName: user.username,
				chatUsers: await Promise.all(user.chatUsers.map(async x => ({
					id: x.id,
					login: x.username,
					avatar: await this.user.getUserAvatar(x.id)
				}))),
				friends: await Promise.all(user.friends.filter(x =>
					user.friendOf.some(friend => friend.id == x.id))
						.map(async x => ({
							id: x.id,
							login: x.username,
							avatar: await this.user.getUserAvatar(x.id)
						}))
				)
			}
			return data;
		}
		else
			return null
	}
	async dropUser(client: Socket) {
		const	user = await this.prisma.user.findUnique({
			where: { socket: client.id }
		});
		if (user) {
			await this.prisma.user.update({
				where: { id: user.id },
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
		const avatar = await this.prisma.user.findUnique({
			where: {
				username: data.sender
			}
		})
		const message = await this.prisma.mESSAGE.create({
			data: {
				sender: data.sender,
				message: data.message,
				avatar: await this.user.getUserAvatar(avatar.id),
				chathistory: {
					connect: {
						id: chatHistorie.id
					}
				}
			}
		});
		return {
			id: message.id,
			message: message.message,
			sender: message.sender,
			avatar: message.avatar,
			// recver: data.recver
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
						message: x.message,
						sender: x.sender,
						avatar: x.avatar
					}
				})].reverse();
				return chatHistory;
			}
			else
				return null;
		}
		return null;
	}
	async getChatUsers(data: NEWCHAT) {
		const	recver = await this.prisma.user.findUnique({
			where: { username: data.recver }
		});
		const	sender = await this.prisma.user.findUnique({
			where: { username: data.sender }
		});
		console.log(sender.id)
		console.log(recver.id)
		await this.prisma.user.update({
			where: {
				id: sender.id
			},
			data: {
				chatUsers: {
					connect: {
						id: recver.id
					}
				}
			}
		});
		await this.prisma.user.update({
			where: {
				id: recver.id
			},
			data: {
				chatUsers: {
					connect: {
						id: sender.id
					}
				}
			}
		});
	}
}
