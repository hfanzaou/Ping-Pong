import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { JwtTwoFaStrategy } from "src/strategy";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [UserModule, JwtModule.register({})],
	providers: [ChatService, ChatGateway, UserService, JwtTwoFaStrategy],
	controllers: [ChatController]
})
export class ChatModule {}
