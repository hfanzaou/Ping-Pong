import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";

@WebSocketGateway({cors: true})
export class ChatGateway implements
OnGatewayConnection,
OnGatewayDisconnect {
	constructor(private chatService: ChatService) {}
	@WebSocketServer() server: Server
	@SubscribeMessage("server")
	handelMessage(client: Socket, data: string) {
		this.server
			.emit("client", data);
		console.log(`message: ${client.id}`);
	}
	async handleConnection(client: Socket) {
		console.log(`connection: ${client.id}`);
	}
	handleDisconnect(client: Socket) {
		console.log(`disconnect: ${client.id}`);
		this.chatService.dropUser(client);
	}
}

