import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { MESSAGE, NEWCHAT, NEWGROUP, USERDATA } from "./myTypes";
import { Socket } from "socket.io"
import { UserService } from "src/user/user.service";
import { compare, hash } from "bcrypt";
import { ChatGateway } from "./chat.gateway";
import { notifDto } from "src/auth/dto/notif.dto";

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService, private user: UserService) {}
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
				},
				blocked: true
			}
		});
		if (user) {
			const data: USERDATA = {
				userName: user.username,
				chatUsers: await Promise.all(user.chatUsers.map(async x => {
					const	chatHistorie = await this.prisma.cHATHISTORY.findFirst({
						where: {
							OR: [
								{ name: `&${userName}${x.username}` },
								{ name: `&${x.username}${userName}`}
							]
						}
					});
					if (chatHistorie)
						return {
							id: x.id,
							login: x.username,
							avatar: await this.user.getUserAvatar(x.id),
							time: chatHistorie.updateAt
						};
				})),
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
					password: x.group.hash ? true : false,
					banded: x.group.banded,
					muted: x.group.muted
				})),
				blocked: user.blocked.map(x => ({
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
				blockedFrom: { some: { username: data.recver }}
			}
		});
		if (!user) {
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
		const	group = await this.prisma.gROUP.findFirst({
			where: {
				name: data.recver,
				members: {
					some: {
						user: {
							username: data.sender
						}
					}
				}
			}
		});
		if ( group &&
			group.banded.find(x => x == data.sender) == undefined &&
			group.muted.find(x => x == data.sender) == undefined ) {
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
		return null;
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
		await this.prisma.cHATHISTORY.update({
			where: { id: chatHistorie.id },
			data: { updateAt: new Date() }
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
				},
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
			});
			if (userGroup) {
				await this.prisma.userGROUP.delete({
					where: {
						userid_groupId: {
							userid: user.id,
							groupId: group.id
						}
					}
				});
				if (chatHistory) {
					const	userchatHistory = await this.
						prisma.userCHATHISTORY.findUnique({
							where: {
								userid_chathistoryid: {
									userid: user.id,
									chathistoryid: chatHistory.id
								}
							}
					});
					if (userchatHistory)
						await this.prisma.userCHATHISTORY.delete({
							where: {
								userid_chathistoryid: {
									userid: user.id,
									chathistoryid: chatHistory.id
								}
							}
						});
				}
				
			}
			else {
				await this.prisma.userGROUP.create({
					data: {
						userid: user.id,
						groupId: group.id
					}
				});
				if ( group.invited.find(x => x == user.username )) {
					const	updatedInvited = group.invited.filter(x => {
						return x != user.username;
					});
					await this.prisma.gROUP.update({
						where: { id: group.id },
						data: { invited: updatedInvited }
					});
				}
				if (chatHistory)
					await this.prisma.userCHATHISTORY.create({
						data: {
							userid: user.id,
							chathistoryid: chatHistory.id
						}
					});
			}
		}
		const	updatedUser = await this.prisma.user.findUnique({
				where: { username: data.userName },
				include: { groups: { include: { group: true }}}
			});
		if (updatedUser)
			return updatedUser.groups.map(x => ({
				id: x.group.id,
				name: x.group.name,
				password: x.group.hash ? true : false
			}));
		return ;
	}
	async getCheckPassword(data: { name: string, password: string}) {
		const	group = await this.prisma.gROUP.findUnique({
			where: { name: data.name }
		});
		const	match = await compare(data.password, group.hash);

		return (match);
	}
	async whoIAm(id: string) {
		const	user = await this.prisma.user.findFirst({ where: { socket: id }});
		return user;
	}
	async getGroupUsers(name: string) {
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: name },
			include: {
				members: {
					include: { user: true }
				}
			}
		});
		if (group) {
			const	users = await Promise.all(group.members.map(async x => {
				let	role = "";
				if (x.user.username == group.owner)
					role = "owner";
				else
					for (let i = 0; i < group.admins.length; i++)
						if (x.user.username == group.admins[i])
							role = "admin";
				if (!role.length)
					role = "member"
				return ({
					id: x.user.id,
					avatar: await this.user.getUserAvatar(x.user.id),
					userName: x.user.username,
					role: role
				})
			}));
			return users;
		}
		return [];
	}
	async addGroupAdmin(data: { name: string, userName: string }) {
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: data.name },
		});
		const	updatedAdmins = [ ...group.admins, data.userName ];
		if (group) {
			await this.prisma.gROUP.update({
				where: { id: group.id },
				data: { admins: updatedAdmins}
			})
		};
	}
	async removeGroupAdmin(data: { name: string, userName: string }) {
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: data.name },
		});
		const	updatedAdmins = group.admins.filter(x => x != data.userName);
		if (group) {
			await this.prisma.gROUP.update({
				where: { id: group.id },
				data: { admins: updatedAdmins}
			})
		};
	}
	async addGroupMute(data: { name: string, userName: string }) {
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: data.name },
		});
		const	updatedMuted = [ ...group.muted, data.userName ];
		if (group) {
			await this.prisma.gROUP.update({
				where: { id: group.id },
				data: { muted: updatedMuted}
			})
		};
	}
	async removeGroupMute(data: { name: string, userName: string }) {
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: data.name },
		});
		const	updatedMuted = group.muted.filter(x => x != data.userName);
		if (group) {
			await this.prisma.gROUP.update({
				where: { id: group.id },
				data: { muted: updatedMuted}
			})
		};
	}
	async addGroupBan(data: { name: string, userName: string }) {
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: data.name },
		});
		const	updatedBaned = [ ...group.banded, data.userName ];
		if (group) {
			await this.prisma.gROUP.update({
				where: { id: group.id },
				data: { banded: updatedBaned}
			})
		};
	}
	async removeGroupBan(data: { name: string, userName: string }) {
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: data.name },
		});
		const	updatedBaned = group.banded.filter(x => x != data.userName);
		if (group) {
			await this.prisma.gROUP.update({
				where: { id: group.id },
				data: { banded: updatedBaned}
			})
		};
	}
	async groupKick(data: { name: string, userName: string }) {
		const	user = await this.prisma.user.findFirst({
			where: { username: data.userName}
		});
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: data.name}
		});
		const	chatHistory = await this.prisma.cHATHISTORY.findFirst({
			where: { name: data.name}
		});
		if (user && group) {
			const	userGroup = await this.prisma.userGROUP.findFirst({
				where: { userid: user.id, groupId: group.id }
			})
			if (userGroup) {
				await this.prisma.userGROUP.delete({
					where: { userid_groupId: { userid: user.id, groupId: group.id }}
				});
				if (chatHistory)
					await this.prisma.userCHATHISTORY.delete({
						where: {
							userid_chathistoryid: {
								userid: user.id,
								chathistoryid: chatHistory.id
							}
						}
					});
			}
		}
	}
	async inviteGroup(data: { userName: string, name: string }) {
		const	user = await this.prisma.user.findFirst({
			where: {
				username: data.userName,
				groups: { none: { group: { name: data.name }}}
			}
		});
		if (user)
		{
			const	group = await this.prisma.gROUP.findFirst({
				where: { name: data.name }
			});
			if (!group)
				return false;
			if ( !group.invited.find( x => x == data.userName )) {
				const	updaterGroupInvited = [ ...group.invited, data.userName ];
				await this.prisma.gROUP.update({
					where: { name: data.name },
					data: { invited: updaterGroupInvited }
				});
				return true;
			}
		}
		return false;
	}
	async checkUserGroup(data: { userName: string, name: string }) {
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: data.name },
			include: {members: {include: { user: true}}}
		});
		if (group &&
			(group.invited.find(x => x == data.userName) ||
				group.members.find(x => x.user.username == data.userName)))
			return true;
		return false;
	}
	async privateJoin(data: { name: string }) {
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: data.name }
		})
		if (group) {
			return [{
				id: group.id,
				name: group.name,
				password: group.hash ? true : false,
				banded: group.banded,
				muted: group.muted
			}];
		}
		return [];
	}
	async groupsChage(data: {
		name: string,
		old: string,
		password: string,
		oldName: string
	}) {
		const	oldGroup = await this.prisma.gROUP.findFirst({
			where: { name: data.oldName }
		});
		if (oldGroup) {
			if (data.name.length) {
				const	group = await this.prisma.gROUP.findFirst({
					where: { name: data.name }
				});
				if (group)
					return "wrongUser";
				await this.prisma.gROUP.update({
					where: { id: oldGroup.id },
					data: { name: data.name }
				});
				await this.prisma.cHATHISTORY.update({
					where: { name: oldGroup.name },
					data: { name: data.name }
				});
			}
			if (data.old.length) {
				const	match = await compare(data.old, oldGroup.hash);
				if (!match)
					return "wrongPassword";
				let	hashed : string | null;
				if (data.password.length)
					hashed = await hash(data.password, 10);
				else
					hashed = null;
				await this.prisma.gROUP.update({
					where: { id: oldGroup.id },
					data: { hash: hashed }
				});
			}
			else if (data.password.length)
				await this.prisma.gROUP.update({
					where: { id: oldGroup.id },
					data: { hash: await hash(data.password, 10) }
				});
			return "DONE";
		}
	}
	async checkGroup(data: { name: string }) {
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: data.name }
		});
		if (group)
			return true;
		return false
	}
	async getNotificationUsers(payload: notifDto, id: number) {
		const group = await this.prisma.gROUP.findFirst({
			where: { name: payload.reciever },
			include: { members: { include: { user: true }}}
		});
		if (group) {
			return group.members.map(x => {
				if (x.user.id != id)
					return { socket: x.user.socket, userName: x.user.username };
			});
		}
		return null;
	}
}
