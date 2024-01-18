import { Body, Controller, Get, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { NEWCHAT, NEWGROUP } from "./myTypes";

@Controller()
export class ChatController {
	constructor(private chatService: ChatService) {}
	@Post("chatUser")
	async handleUser(@Body() data: { userName: string }) {
		const	user = await this.chatService.getUserData(data.userName);
		return user;
	}
	@Post("chathistoryPrivate")
	async handleHistoryPrivate(@Body() data: NEWCHAT) {
		const	history = await this.chatService.getUserHistoryPrivate(data);
		return history;
	}
	@Post("chathistoryRoom")
	async handleHistoryRoom(@Body() data: NEWCHAT) {
		const	history = await this.chatService.getUserHistoryRoom(data);
		return history;
	}
	@Post("chatUsers")
	async handleUsers(@Body() data: NEWCHAT) {
		await this.chatService.getChatUsers(data);
	}
	@Post("createGroup")
	async handleCreateGroup(@Body() data: {data: NEWGROUP}) {
		const condition = await this.chatService.addGroup(data.data);
		return condition;
	}
	@Post("onlineoffline")
	async handleOnlineOffline(@Body() data: {socket: string, username: string}) {
		await this.chatService.OnlineOffline(data.socket, data.username);
	}
	@Get("searchList")
	async handlegetSearchList() {
		const	groups = await this.chatService.getSearchList();
		return groups;
	}
	@Post("leaveJoin")
	async handleLeaveJoin(@Body() data: { userName: string, name: string}) {
		const	groups = await this.chatService.getLeaveJoin(data);
		return groups;
	}
	@Post("checkPassword")
	async handleCheckPassword(@Body() data: { name: string, password: string}) {
		const	answer = await this.chatService.getCheckPassword(data);
		return answer;
	}
}
