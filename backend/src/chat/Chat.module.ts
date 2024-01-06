import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";

@Module({
	imports: [UserModule],
	providers: [ChatService, ChatGateway, UserService],
	controllers: [ChatController]
})
export class ChatModule {}
