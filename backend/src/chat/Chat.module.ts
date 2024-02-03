import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { JwtTwoFaStrategy } from "src/strategy";
import { JwtModule } from "@nestjs/jwt";
import { GameController } from "src/game/game.controller";
import { GameModule } from "src/game/game.module";

@Module({
	imports: [UserModule, JwtModule.register({})],
	providers: [ChatService, ChatGateway, UserService, JwtTwoFaStrategy, GameModule],
	controllers: [ChatController],
	exports: [ChatService]
})
export class ChatModule {}
