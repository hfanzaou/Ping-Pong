import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { NEWCHAT, NEWGROUP } from "./myTypes";
import JwtTwoFaGuard from "src/auth/guard/twoFaAuth.guard";

@UseGuards(JwtTwoFaGuard)
@Controller()
export class ChatController {
	constructor(private chatService: ChatService) {}
	@Post("chatUser")
	async handleUser(@Body() data: { userName: string }, @Req() req) {
		if (req.user.username == data.userName) {
			const	user = await this.chatService.getUserData(data.userName);
			return user;
		}
	}
	@Post("chathistoryPrivate")
	async handleHistoryPrivate(@Body() data: NEWCHAT, @Req() req) {
		if (req.user.username == data.sender) {
			const	history = await this.chatService.getUserHistoryPrivate(data);
			return history;
		}
	}
	@Post("chathistoryRoom")
	async handleHistoryRoom(@Body() data: NEWCHAT, @Req() req) {
		if (req.user.username == data.sender) {
			const	history = await this.chatService.getUserHistoryRoom(data);
			return history;
		}
	}
	@Post("chatUsers")
	async handleUsers(@Body() data: NEWCHAT, @Req() req) {
		if (req.user.username == data.sender)
			await this.chatService.getChatUsers(data);
	}
	@Post("createGroup")
	async handleCreateGroup(@Body() data: {data: NEWGROUP}, @Req() req) {
		if (req.user.username == data.data.owner) {
			const condition = await this.chatService.addGroup(data.data);
			return condition;
		}
	}
	@Post("onlineoffline")
	async handleOnlineOffline(
		@Body() data: {socket: string, username: string},
		@Req() req
	) {
		if (req.user.username == data.username)
			await this.chatService.OnlineOffline(data.socket, data.username);
	}
	@Get("searchList")
	async handlegetSearchList() {
			const	groups = await this.chatService.getSearchList();
			return groups;
	}
	@Post("leaveJoin")
	async handleLeaveJoin(@Body() data: { userName: string, name: string}, @Req() req) {
		if (req.user.username == data.userName) {
			const	groups = await this.chatService.getLeaveJoin(data);
			return groups;
		}
	}
	@Post("checkPassword")
	async handleCheckPassword(@Body() data: { name: string, password: string}) {
		const	answer = await this.chatService.getCheckPassword(data);
		return answer;
	}
	@Post("groupUsers")
	async handleGroupUsers(
		@Body() data: { name: string, userName: string },
		@Req() req
	) {
		if (req.user.username == data.userName) {
			const	users = await this.chatService.getGroupUsers(data.name);
			return users;
		}
	}
	@Post("addGroupAdmin")
	async handleAddGroupAdmin(
		@Body() data: { name: string, userName: string, sender: string },
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.addGroupAdmin(data);
	}
	@Post("removeGroupAdmin")
	async handleRemoveGroupAdmin(
		@Body() data: { name: string, userName: string, sender: string },
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.removeGroupAdmin(data);
	}
	@Post("addGroupMute")
	async handleAddGroupMute(
		@Body() data: { name: string, userName: string, sender: string },
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.addGroupMute(data);
	}
	@Post("removeGroupMute")
	async handleRemoveGroupMute(
		@Body() data: { name: string, userName: string, sender: string },
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.removeGroupMute(data);
	}
	@Post("addGroupBan")
	async handleAddGroupBan(
		@Body() data: { name: string, userName: string, sender: string },
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.addGroupBan(data);
	}
	@Post("removeGroupBan")
	async handleRemoveGroupBan(
		@Body() data: { name: string, userName: string, sender: string },
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.removeGroupBan(data);
	}
	@Post("groupKick")
	async handleGroupKick(
		@Body() data: { name: string, userName: string, sender: string },
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.groupKick(data);
	}
	@Post("inviteGroup")
	async handleInviteGroup(
		@Body() data: { userName: string, name: string, sender: string },
		@Req() req
	) {
		if (req.user.username == data.sender)
			return await this.chatService.inviteGroup(data);
	}
	@Post("checkUserGroup")
	async handleCheckUserGroup(
		@Body() data: { userName: string, name: string },
		@Req() req
	) {
		if (req.user.username == data.userName)
			return await this.chatService.checkUserGroup(data);
	}
	@Post("privateJoin")
	async handlePrivateJoin(
		@Body() data: { name: string, userName: string },
		@Req() req
	) {
		if (req.user.username == data.userName)
			return await this.chatService.privateJoin(data);
	}
	@Post("groupsChage")
	async handleGroupsChage(@Body() data: {
			name: string,
			old: string,
			password: string,
			oldName: string,
			userName: string
		},
		@Req() req
	) {
		if (req.user.username == data.userName)
			return await this.chatService.groupsChage(data);
	}
	@Post("checkGroup")
	async handleCheckGroup(
		@Body() data: { name: string, userName: string },
		@Req() req
	) {
		if (req.user.username == data.userName)
			return await this.chatService.checkGroup(data);
	}
	@Post("chatAvatarPrivate")
	async handleChatAvatarPrivate(
		@Body() data: { userName1: string, userName2: string },
		@Req() req
	) {
		if (req.user.username == data.userName1)
			return await this.chatService.chatAvatarPrivate(data);
	}
	@Post("chatAvatarRoom")
	async handleChatAvatarRoom(
		@Body() data: { name: string, userName: string },
		@Req() req
	) {
		if (req.user.username == data.userName)
			return await this.chatService.chatAvatarRoom(data);
	}
	// @Post("numberOfMessages")
	// async handleNumberOfMessages(@Body() data: { userName: string, sender: string }) {
	// 	return await this.chatService.numberOfMessages(data.userName, data.sender);
	// }
}
