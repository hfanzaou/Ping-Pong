import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { UserService } from "src/user/user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtTwoFaStrategy } from "src/strategy";

@Module({
	providers: [GameService, GameGateway, UserService, PrismaService, UserService, JwtTwoFaStrategy],
	controllers: [GameController]
})
export class GameModule {}
