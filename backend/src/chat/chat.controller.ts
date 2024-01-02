import { Body, Controller, Get, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { USERSOCKET } from "./myTypes";

@Controller()
export class ChatController {
	constructor(private chatService: ChatService) {}
	@Post("chatUser")
	async handleUser(@Body() userSocket: USERSOCKET) {
		const	user = await this.chatService.getUserData(userSocket);
		return user;
	}
}
