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
import { Req, UseGuards } from "@nestjs/common";
import JwtTwoFaGuard from "src/auth/guard/twoFaAuth.guard";
import { AuthService } from "src/auth/auth.service";
import { notifDto } from "src/auth/dto/notif.dto";
import { PrismaService } from "src/prisma/prisma.service";

<<<<<<< HEAD
@WebSocketGateway({cors: true, headers: true})
=======
@WebSocketGateway({ cors: {
	origin: 'http://localhost:3000',
    credentials: true
} })
>>>>>>> master
export class ChatGateway implements
OnGatewayConnection,
OnGatewayDisconnect {
	constructor(private chatService: ChatService, private prisma: PrismaService) {}
	@WebSocketServer() server: Server
	@SubscribeMessage("server")
	async handelMessage(client: Socket, data: MESSAGE) {
<<<<<<< HEAD
		// console.log(Array.from(client.rooms).slice(1));

=======
>>>>>>> master
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
		// console.log(client.id);
		// console.log(client.handshake.headers.cookie);
	}
	handleDisconnect(client: Socket) {
		this.chatService.dropUser(client);
	}


	////////
	////////
	@SubscribeMessage('addnotification')
	async handleNotification(client: Socket, payload: notifDto) {
	 const cookie = client.handshake.headers.cookie;
	console.log(cookie);
	 	console.log(payload);
	  //const user = this.auth.validateUser();
	  const receiver = await this.prisma.user.findUnique({
		where: {username: payload.reciever},
		select: {socket: true}
	  })
	  console.log('here');
	  client.emit('getnotification', 'hello');
	  return 'Hello world!';
	}
}
