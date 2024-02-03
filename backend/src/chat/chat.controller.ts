import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { NEWCHAT, NEWGROUP, name, old, password, sender, socket, userName, userName1 } from "./myTypes";
import JwtTwoFaGuard from "src/auth/guard/twoFaAuth.guard";

@UseGuards(JwtTwoFaGuard)
@Controller()
export class ChatController {
	constructor(private chatService: ChatService) {}
	@Post("chatUser")
	async handleUser(@Body() data: userName, @Req() req) {
		if (req.user.username == data.userName) {
			const	user = await this.chatService.getUserData(data.userName);
			return user;
		}
		return null;
	}
	@Post("chathistoryPrivate")
	async handleHistoryPrivate(@Body() data: NEWCHAT, @Req() req) {
		if (req.user.username == data.sender) {
			const	history = await this.chatService.getUserHistoryPrivate(data);
			return history;
		}
		return null;
	}
	@Post("chathistoryRoom")
	async handleHistoryRoom(@Body() data: NEWCHAT, @Req() req) {
		if (req.user.username == data.sender) {
			const	history = await this.chatService.getUserHistoryRoom(data);
			return history;
		}
		return null;
	}
	@Post("chatUsers")
	async handleUsers(@Body() data: NEWCHAT, @Req() req) {
		if (req.user.username == data.sender)
			await this.chatService.getChatUsers(data);
	}
	@Post("createGroup")
	async handleCreateGroup(@Body() data: {data: NEWGROUP}, @Req() req) {
		if (data && data.data && req.user.username == data.data.owner) {
			const condition = await this.chatService.addGroup(data.data);
			return condition;
		}
		return false;
	}
	@Post("onlineoffline")
	async handleOnlineOffline(
		@Body() data: socket,
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
	async handleLeaveJoin(@Body() data: name, @Req() req) {
		if (req.user.username == data.userName) {
			const	groups = await this.chatService.getLeaveJoin(data);
			return groups;
		}
	}
	@Post("checkPassword")
	async handleCheckPassword(@Body() data: password) {
		const	answer = await this.chatService.getCheckPassword(data);
		return answer;
	}
	@Post("groupUsers")
	async handleGroupUsers(
		@Body() data: name,
		@Req() req
	) {
		if (req.user.username == data.userName) {
			const	users = await this.chatService.getGroupUsers(data.name);
			return users;
		}
		return [];
	}
	@Post("addGroupAdmin")
	async handleAddGroupAdmin(
		@Body() data: sender,
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.addGroupAdmin(data);
	}
	@Post("removeGroupAdmin")
	async handleRemoveGroupAdmin(
		@Body() data: sender,
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.removeGroupAdmin(data);
	}
	@Post("addGroupMute")
	async handleAddGroupMute(
		@Body() data: sender,
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.addGroupMute(data);
	}
	@Post("removeGroupMute")
	async handleRemoveGroupMute(
		@Body() data: sender,
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.removeGroupMute(data);
	}
	@Post("addGroupBan")
	async handleAddGroupBan(
		@Body() data: sender,
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.addGroupBan(data);
	}
	@Post("removeGroupBan")
	async handleRemoveGroupBan(
		@Body() data: sender,
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.removeGroupBan(data);
	}
	@Post("groupKick")
	async handleGroupKick(
		@Body() data: sender,
		@Req() req
	) {
		if (req.user.username == data.sender)
			await this.chatService.groupKick(data);
	}
	@Post("inviteGroup")
	async handleInviteGroup(
		@Body() data: sender,
		@Req() req
	) {
		if (req.user.username == data.sender)
			return await this.chatService.inviteGroup(data);
		return false;
	}
	@Post("checkUserGroup")
	async handleCheckUserGroup(
		@Body() data: name,
		@Req() req
	) {
		if (req.user.username == data.userName)
			return await this.chatService.checkUserGroup(data);
		return false;
	}
	@Post("privateJoin")
	async handlePrivateJoin(
		@Body() data: name,
		@Req() req
	) {
		if (req.user.username == data.userName)
			return await this.chatService.privateJoin(data);
		return [];
	}
	@Post("groupsChage")
	async handleGroupsChage(@Body() data: old,
		@Req() req
	) {
		if (req.user.username == data.userName)
			return await this.chatService.groupsChage(data);
		return "";
	}
	@Post("checkGroup")
	async handleCheckGroup(
		@Body() data: name,
		@Req() req
	) {
		if (req.user.username == data.userName)
			return await this.chatService.checkGroup(data);
		return false;
	}
	@Post("chatAvatarPrivate")
	async handleChatAvatarPrivate(
		@Body() data: userName1,
		@Req() req
	) {
		if (req.user.username == data.userName1)
			return await this.chatService.chatAvatarPrivate(data);
		return null;
	}
	@Post("chatAvatarRoom")
	async handleChatAvatarRoom(
		@Body() data: name,
		@Req() req
	) {
		if (req.user.username == data.userName)
			return await this.chatService.chatAvatarRoom(data);
		return null;
	}
}
