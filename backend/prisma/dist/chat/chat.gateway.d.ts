import { Server, Socket } from "socket.io";
export declare class ChatGateway {
    server: Server;
    handelMessage(client: Socket, data: string): void;
}
