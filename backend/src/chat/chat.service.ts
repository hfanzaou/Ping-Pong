import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { MESSAGE, NEWCHAT, NEWGROUP, USERDATA } from "./myTypes";
import { Socket } from "socket.io"
import { UserService } from "src/user/user.service";
import { compare, hash } from "bcrypt";
import { ChatGateway } from "./chat.gateway";

@Injectable()
export class ChatService {
	// private rooms: string[];

	constructor(private prisma: PrismaService, private user: UserService) {
		// this.rooms = [];
	}
	async getUserData(userName: string) {
		const	user = await this.prisma.user.findUnique({
			where: { username: userName },
			include: {
				chatUsers: true,
				friends: true,
				friendOf: true,
				groups: {
					include: {
						group: true
					}
				}
			}
		});
		if (user) {
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
				),
				groups: user.groups.map(x => ({
					id: x.group.id,
					name: x.group.name,
					password: x.group.hash ? true : false
				}))
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
			return user;
		}
		return null;
	}
	async getRoomDirect(data: NEWCHAT) {
		const	user = await this.prisma.user.findUnique({
			where: {
				username: data.sender,
				chatUsers: { some: { username: data.recver }}
			}
		});
		if (user) {
			let	chatHistorie = await this.prisma.cHATHISTORY.findFirst({
				where: {
					OR: [
						{ name: `&${data.recver}${data.sender}` },
						{ name: `&${data.sender}${data.recver}` }
					]
				}
			});
			if (!chatHistorie) {
				chatHistorie = await this.prisma.cHATHISTORY.create({
					data: {
						name: `&${data.recver}${data.sender}`,
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
			return chatHistorie.name;
		}
		return null;
	}
	async getRoomRoom(data: NEWCHAT) {
		let	chatHistorie = await this.prisma.cHATHISTORY.findFirst({
			where: { name: data.recver }
		});
		if (!chatHistorie) {
			chatHistorie = await this.prisma.cHATHISTORY.create({
				data: {
					name: data.recver,
					users: {
						create: [
							{
								user: {
									connect: {
										username: data.sender
									}
								}
							}
						]
					}
				}
			});
		}
		return chatHistorie.name;
	}
	async addMessagePrivate(data: MESSAGE) {
		const	chatHistorie = await this.prisma.cHATHISTORY.findFirst({
			where: {
				OR: [
					{
						name: `&${data.recver}${data.sender}`
					},
					{
						name: `&${data.sender}${data.recver}`
					}
				]
			}
		});
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
	async addMessageRoom(data: MESSAGE) {
		const	chatHistorie = await this.prisma.cHATHISTORY.findUnique({
			where: { name: data.recver }
		})
		const avatar = await this.prisma.user.findUnique({
			where: { username: data.sender }
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
	async getUserHistoryPrivate(data: NEWCHAT) {
		if (data.sender && data.recver) {
			const history = await this.prisma.cHATHISTORY.findFirst({
				where: {
					OR: [
						{
							name: `&${data.recver}${data.sender}`
						},
						{
							name: `&${data.sender}${data.recver}`
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
	async getUserHistoryRoom(data: NEWCHAT) {
		if (data.sender && data.recver) {
			const history = await this.prisma.cHATHISTORY.findFirst({
				where: { name: data.recver },
				include: { messages: true }
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
	async newMessage(recver: string) {
		const user = await this.prisma.user.findUnique({
			where: { username: recver },
		});
		return (user.socket);
	}
	async addGroup(data: NEWGROUP) {
		const	user = await this.prisma.user.findUnique({
			where: { username: data.owner }
		})
		try {
			await this.prisma.cHATHISTORY.create({
				data: {
					users: { create: [{ user: { connect: { id: user.id }}}]},
					name: data.name
				}
			});
			await this.prisma.gROUP.create({
				data: {
					name: data.name,
					owner: data.owner,
					admins: [data.owner],
					state: data.state,
					hash: data.password.length > 0 ?
						await hash(data.password, 10) :
						null,
					members: { create: [{ user: { connect: { id: user.id}}}]}
				}
			});
		}
		catch {
			return false;
		}
		return true;
	}
	async OnlineOffline(socket: string, username: string) {
		const	user = await this.prisma.user.findUnique({
			where: { username: username }
		})
		if (user) {
			await this.prisma.user.update({
				where: { id: user.id },
				data: {
					state: "Online",
					socket: socket
				}
			});
            
		}
	}
	async getSearchList() {
		const	groups = await this.prisma.gROUP.findMany({
			where: { state: "Public" }
		})
		return groups.map(x => ({
			id: x.id,
			name: x.name,
			password: x.hash ? true : false 
		}));
	}
	async getLeaveJoin(data: { userName: string, name: string}) {
		const	user = await this.prisma.user.findUnique({
			where: { username: data.userName },
		});
		const	group = await this.prisma.gROUP.findUnique({
			where: { name: data.name }
		});
		const	chatHistory = await this.prisma.cHATHISTORY.findUnique({
			where: { name: data.name }
		});
		if (user && group) {
			const	userGroup = await this.prisma.userGROUP.findUnique({
				where: {
					userid_groupId: {
						userid: user.id,
						groupId: group.id
					}
				}
			})
			if (userGroup) {
				await this.prisma.userGROUP.delete({
					where: {
						userid_groupId: {
							userid: user.id,
							groupId: group.id
						}
					}
				});
				await this.prisma.userCHATHISTORY.delete({
					where: {
						userid_chathistoryid: {
							userid: user.id,
							chathistoryid: chatHistory.id
						}
					}
				});
				
			}
			else {
				await this.prisma.userGROUP.create({
					data: {
						userid: user.id,
						groupId: group.id
					}
				});
				await this.prisma.userCHATHISTORY.create({
					data: {
						userid: user.id,
						chathistoryid: chatHistory.id
					}
				});
			}
		}
		const	updatedUser = await this.prisma.user.findUnique({
				where: { id: user.id },
				include: { groups: { include: { group: true }}}
			});
		return updatedUser.groups.map(x => ({
			id: x.group.id,
			name: x.group.name,
			password: x.group.hash ? true : false
		}));
	}
	async getCheckPassword(data: { name: string, password: string}) {
		const	group = await this.prisma.gROUP.findUnique({
			where: { name: data.name }
		});
		const	match = await compare(data.password, group.hash);

		return (match);
	}
}
