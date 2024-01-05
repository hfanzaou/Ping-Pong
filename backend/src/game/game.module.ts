import { Module } from "@nestjs/common";
// import { ChatController } from "./chat.controller";
import { GameGateway } from "./game.gateway";
import { GameController } from "./game.controller";

@Module({
	providers: [GameGateway],
	controllers: [GameController]
})
export class GameModule {}