import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({cors: true})
export class ChatGateway {
	@WebSocketServer() server: Server
	@SubscribeMessage("server")
	handelMessage(client: Socket, data: string) {
		this.server
			.emit("client", data);
	}
}
