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
		if (userName) {
			const	user = await this.prisma.user.findFirst({
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
								time: chatHistorie.updateAt,
								state: x.state,
								unRead: await this.numberOfMessagesPrivate(
									x.username,
									user.username
								)
							};
					})),
					friends: await Promise.all(user.friends.filter(x =>
						user.friendOf.some(friend => friend.id == x.id))
							.map(async x => ({
								id: x.id,
								login: x.username,
								avatar: await this.user.getUserAvatar(x.id),
								state: x.state
							}))
					),
					groups: await Promise.all(user.groups.map(async x => {
						const	chatHistorie = await this.prisma.cHATHISTORY.findFirst({
							where: { name: x.group.name }
						});
						if (chatHistorie) {
							return {
								id: x.group.id,
								name: x.group.name,
								password: x.group.hash ? true : false,
								banded: x.group.banded,
								muted: x.group.muted,
								time: chatHistorie.updateAt,
								unRead: await this.numberOfMessagesRooms(
									x.group.name,
									user.username
								)
							};
						}
					})),
					blocked: user.blocked.map(x => ({
						id: x.id,
						login: x.username
					}))
				}
				return data;
			}
			else
				return null;
		}
		return null;
	}
	async dropUser(client: Socket) {
		const	user = await this.prisma.user.findFirst({
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
		const	user = await this.prisma.user.findFirst({
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
			group.banded.find(x => x == data.sender) == undefined) {
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
		const message = await this.prisma.mESSAGE.create({
			data: {
				sender: data.sender,
				message: data.message,
				chathistory: {
					connect: {
						id: chatHistorie.id
					}
				},
				readers: [data.sender]
			}
		});
		await this.prisma.cHATHISTORY.update({
			where: { id: chatHistorie.id },
			data: { updateAt: new Date() }
		});
		return {
			id: message.id,
			message: message.message,
			sender: message.sender
		}
	}
	async addMessageRoom(data: MESSAGE) {
		const	chatHistorie = await this.prisma.cHATHISTORY.findFirst({
			where: { name: data.recver }
		})
		await this.prisma.cHATHISTORY.update({
			where: { id: chatHistorie.id },
			data: { updateAt: new Date() }
		});
		const message = await this.prisma.mESSAGE.create({
			data: {
				sender: data.sender,
				message: data.message,
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
			sender: message.sender
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
						sender: x.sender
					}
				})].sort((a, b) => a.id - b.id).reverse();
				return chatHistory;
			}
			else
				return null;
		}
		return null;
	}
	async getUserHistoryRoom(data: NEWCHAT) {
		if (data.sender && data.recver) {
			const	group = await this.prisma.gROUP.findFirst({
				where: {
					name: data.recver,
				},
				include: {
					members: {
						include: {
							user: true
						}
					}
				}
			});
			if (
				group &&
				group.banded.find(x => x == data.sender) == undefined &&
				group.members.find(x => x.user.username == data.sender) != undefined
			) {
				const	history = await this.prisma.cHATHISTORY.findFirst({
					where: { name: data.recver },
					include: { messages: true }
				});
				if (history) {
					const chatHistory = [...history.messages.map(x => {
						return {
							id: x.id,
							message: x.message,
							sender: x.sender,
						}
					})].sort((a, b) => a.id - b.id).reverse();
					return chatHistory;
				}
				else
					return null;
			}
		}
		return null;
	}
	async updateChatUsers(data: MESSAGE) {
		const	sender = await this.prisma.user.findFirst({
			where: {
				username: data.sender,
				chatUsers: { none: { username: data.recver}}
			}
		});
		if (sender) {
			const	recver = await this.prisma.user.findFirst({
				where: { username: data.recver }
			});
			if (recver) {
				await this.prisma.user.update({
					where: {
						id: sender.id
					},
					data: {
						chatUsers: {
							connect: {
								id: recver.id
							}
						},
						chatUsersOf: {
							connect: {
								id: recver.id
							}
						}
					}
				});
			}
		}
	}
	async getChatUsers(data: NEWCHAT) {
		const	recver = await this.prisma.user.findFirst({
			where: { username: data.recver }
		});
		if (recver) {
			const	sender = await this.prisma.user.findFirst({
				where: { username: data.sender }
			});
			if (sender) {
				await this.prisma.user.update({
					where: {
						id: sender.id
					},
					data: {
						chatUsers: {
							connect: {
								id: recver.id
							}
						},
						chatUsersOf: {
							connect: {
								id: recver.id
							}
						}
					}
				});
			}
		}
	}
	async newMessage(recver: string) {
		const user = await this.prisma.user.findFirst({
			where: { username: recver },
		});
		if (user)
			return (user.socket);
		return ;
	}
	async newMessageSocket(recver: string) {
		const user = await this.prisma.user.findFirst({
			where: { socket: recver },
		});
		if (user)
			return (user.username);
		return ;
	}
	async addGroup(data: NEWGROUP) {
		const	user = await this.prisma.user.findFirst({
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
		const	user = await this.prisma.user.findFirst({
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
		if (groups)
			return groups.map(x => ({
				id: x.id,
				name: x.name,
				password: x.hash ? true : false 
			}));
		return null;
	}

	async socketTokick(userName: string) {
		if (userName) {
			const	user = await this.prisma.user.findFirst({
				where: {
					username: userName
				}
			});
			if (user) {
				return user.socket;
			}
		}
		return null;
	}

	async getLeaveJoin(data: { userName: string, name: string}) {
		const	user = await this.prisma.user.findFirst({
			where: { username: data.userName },
		});
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: data.name }
		});
		const	chatHistory = await this.prisma.cHATHISTORY.findFirst({
			where: { name: data.name }
		});
		if (user && group) {
			const	userGroup = await this.prisma.userGROUP.findFirst({
				where: {
					userid: user.id,
					groupId: group.id
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
						prisma.userCHATHISTORY.findFirst({
							where: {
								userid: user.id,
								chathistoryid: chatHistory.id
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
		const	updatedUser = await this.prisma.user.findFirst({
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
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: data.name }
		});
		const	match = await compare(data.password, group.hash);

		return (match);
	}
	async whoIAm(id: string) {
		const	user = await this.prisma.user.findFirst({ where: { socket: id }});
		return user;
	}
	async chatAvatarPrivate(data: { userName1: string, userName2: string }) {
		const	user1 = await this.prisma.user.findFirst({
			where: { username: data.userName1 }
		});
		if (user1) {
			const	user2 = await this.prisma.user.findFirst({
				where: { username: data.userName2 }
			});
			if (user2)
				return [
					{
						userName: user1.username,
						avatar: await this.user.getUserAvatar(user1.id)
					},
					{
						userName: user2.username,
						avatar: await this.user.getUserAvatar(user2.id)
					}
				];
		}
		return null;
	}
	async chatAvatarRoom(data: { name: string, userName: string }) {
		const	group = await this.prisma.gROUP.findFirst({
			where: {
				name: data.name
			},
			include: {
				members: {
					include: {
						user: {
							include: {
								blocked: true,
								blockedFrom: true
							}
						}
					}
				}
			}
		});
		if (group) {
			const	users = await Promise.all(
				group.members.filter(x => {
					if (x.user.blocked.find(y => {
						console.log(y.username, data.userName);
						return y.username == data.userName;
					}) == undefined && x.user.blockedFrom.find(y => {
						console.log(y.username, data.userName);
						return y.username == data.userName;
					}) == undefined)
						return group.banded.find(y => y == x.user.username) == undefined;
					return false;
				}).map(async x => ({
					userName: x.user.username,
					avatar: await this.user.getUserAvatar(x.user.id)
				}))
			);
			return users;
		}
		return null;
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
	async usersToUpdate(data: string, socket: string) {
		const	group = await this.prisma.gROUP.findFirst({
			where: { name: data },
			include: { members: { include: { user: true}}}
		});
		if (group) {
			const	user = await this.prisma.user.findFirst({
				where: { socket: socket }
			});
			if (user) {
				const users = group.members.filter(
					x => x.user.username != user.username
				).filter(x => {
						return group.banded.find(y => x.user.username == y) ==
							undefined;
					}).filter(x => {
							return group.muted.find(y => x.user.username == y) ==
								undefined;
						}).map(x => x.user.username);
				return users;
			}
		}
		return null;
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
				where: {
					id: group.id
				},
				data: {
					banded: updatedBaned,
				}
			});
		};
	}

	async banedSocket(userName: string) {
		const	{socket} = await this.prisma.user.findFirst({
			where: {
				username: userName
			}
		});
		return (socket);
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
	async inviteGroup(data: { userName: string, name: string, sender: string }) {
		const	user = await this.prisma.user.findFirst({
			where: {
				username: data.userName,
				groups: { none: { group: { name: data.name }}},
				blocked: {
					none: {
						username: data.sender
					}
				},
				blockedFrom: {
					none: {
						username: data.sender
					}
				}
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
		if (group && group.invited.find(x => x == data.userName))
			return true;
		return false;
	}
	async privateJoin(data: { name: string, userName: string }) {
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
		oldName: string,
		userName: string
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
	async checkGroup(data: { name: string, userName: string }) {
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
	async numberOfMessagesPrivate(userName: string, sender: string) {
		const	chatHistorie = await this.prisma.cHATHISTORY.findFirst({
			where: {
				OR: [
					{ name: `&${userName}${sender}` },
					{ name: `&${sender}${userName}`}
				]
			},
			include: { messages: true }
		});
		const	unReadMessages = chatHistorie.messages.filter(x => {
			return x.readers.find(y => y == sender) == undefined;
		});
		return unReadMessages.length;
	}
	async numberOfMessagesRooms(name: string, sender: string) {
		const	chatHistorie = await this.prisma.cHATHISTORY.findFirst({
			where: {
				name: name
			},
			include: { messages: true }
		});
		const	unReadMessages = chatHistorie.messages.filter(x => {
			return x.readers.find(y => y == sender) == undefined;
		});
		return unReadMessages.length;
	}
	async updateReadPrivate(data: NEWCHAT) {
		const	chatHistorie = await this.prisma.cHATHISTORY.findFirst({
			where: {
				OR: [
					{ name: `&${data.recver}${data.sender}` },
					{ name: `&${data.sender}${data.recver}`}
				]
			}
		});
		if (chatHistorie) {
			const	unReadMessages = (await this.prisma.mESSAGE.findMany({
				where: {chathistoryid: chatHistorie.id}
			})).filter(x => {
				return x.readers.find(y => y == data.sender) == undefined;
			});
			for (const message of unReadMessages) {
				const	updatedReaders = [...message.readers, data.sender];
				await this.prisma.mESSAGE.update({
					where: {id: message.id},
					data: {readers: updatedReaders}
				});
			}
		}
	}
}
