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
import { JwtTwoFaStrategy } from "src/strategy";
import { UserService } from "src/user/user.service";

@WebSocketGateway({ cors: {
	origin: 'http://localhost:3000',
    credentials: true
} })
export class ChatGateway implements
OnGatewayConnection,
OnGatewayDisconnect {
	constructor(private chatService: ChatService, 
				private prisma: PrismaService, 
				private strategy: JwtTwoFaStrategy,
				private user: UserService) {}
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
        console.log("test");
		// console.log(client.handshake.headers.cookie);
	}
	async handleDisconnect(client: Socket) {
        await this.chatService.dropUser(client);
		const {username, state} = await this.verifyClient(client);
		client.broadcast.emit("online", {username, state});
	}



	////////
	////////
	@SubscribeMessage('addnotification')
	async handleNotification(client: Socket, payload: notifDto) {
		const {id} = await this.verifyClient(client);
	  	const reciever = await this.prisma.user.findUnique({
		where: {username: payload.reciever},
		select: {id: true, socket: true}
	  })
	  await this.user.addNotification(id, payload);
	  client.to(reciever.socket).emit('getnotification', 'hello');
	}
	@SubscribeMessage("state")
    async handleOnline(client: Socket) {
		const {username, state} = await this.verifyClient(client);
        client.broadcast.emit("online", {username, state});
    }
	async verifyClient(client: Socket) {
		try {
			const token = client.handshake.headers.cookie.split('jwt=')[1];
			const payload = await this.strategy.verifyToken(token);
			return (await this.strategy.validate(payload));
		}
		catch (error) {
			client.emit('error', 'invalid token');
		}
	}
}
