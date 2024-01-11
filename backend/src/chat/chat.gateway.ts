import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { MESSAGE, NEWCHAT } from "./myTypes";

@WebSocketGateway({ cors: {
	origin: 'http://localhost:3000',
    credentials: true
} })
export class ChatGateway implements
OnGatewayConnection,
OnGatewayDisconnect {
	constructor(private chatService: ChatService) {}
	@WebSocketServer() server: Server
	@SubscribeMessage("server")
	async handelMessage(client: Socket, data: MESSAGE) {
		const room = this.chatService.getRoom(data);
		const message = await this.chatService.addMessage(data);
		this.server
		.to(room)
		.emit("client", message);
	}
	@SubscribeMessage("newChat")
	async handelNewChat(client: Socket, data: NEWCHAT) {
		Array
		.from(client.rooms)
		.slice(1)
		.forEach(room => client.leave(room));
		const room = this.chatService.getRoom(data);
		client.join(room);
	}
	@SubscribeMessage("newUser")
	async handelUser(client: Socket, data: string) {
		const recver = await this.chatService.newMessage(data);
		this.server
			.to(recver)
			.emit("newuser");
	}
	handleConnection(client: Socket) {
		console.log(client.id);
		// console.log(client.handshake.headers.cookie);
	}
	handleDisconnect(client: Socket) {
		this.chatService.dropUser(client);
	}
}
