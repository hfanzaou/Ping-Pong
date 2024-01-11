import { Body, Controller, Get, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { NEWCHAT, NEWGROUP, USERSOCKET } from "./myTypes";

@Controller()
export class ChatController {
	constructor(private chatService: ChatService) {}
	@Post("chatUser")
	async handleUser(@Body() userSocket: USERSOCKET) {
		const	user = await this.chatService.getUserData(userSocket);
		return user;
	}
	@Post("chathistory")
	async handleHistory(@Body() data: NEWCHAT) {
		const	history = await this.chatService.getUserHistory(data);
		return history;
	}
	@Post("chatUsers")
	async handleUsers(@Body() data: NEWCHAT) {
		// console.log("here")
		await this.chatService.getChatUsers(data);
	}
	@Post("createGroup")
	async handleCreateGroup(@Body() data: {data: NEWGROUP}) {
		// console.log(data);
		const condition = await this.chatService.addGroup(data.data);
		return condition;
	}
}
