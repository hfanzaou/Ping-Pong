import { Module } from "@nestjs/common";
// import { ChatController } from "./chat.controller";
import { GameController } from "./game.controller";

@Module({
	providers: [],
	controllers: [GameController]
})
export class GameModule {}