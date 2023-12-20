import { Body, Controller, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller()
export class ChatController {
	constructor(private chatService: ChatService) {}
	@Post("chat")
	getData(@Body() body: any) {
		console.log(body);
		return this.chatService.getData();
	}
}
