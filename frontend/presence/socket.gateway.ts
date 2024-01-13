import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { Logger } from '@nestjs/common';
import { Server } from 'http';
import { subscribe } from 'diagnostics_channel';

@WebSocketGateway({cors: true})
export class SocketGateway implements OnGatewayConnection {
  private logger: Logger = new Logger('PresenceGateway');

  @WebSocketServer() server: Server;

//   @WebSocketServer()
//   private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  handleConnection(client: Socket, username: string): void {
    this.socketService.handleConnection(client, username);
    
  }

//   handleDisconnect(socket, username: string): void {
//     this.socketService.handleDisconnect(socket, username);
//   }
  // Implement other Socket.IO event handlers and message handlers
}