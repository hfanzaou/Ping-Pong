import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class SocketService {
    constructor(private prismaservice: PrismaService) {}

//   private readonly connectedClients: Map<string, Socket> = new Map();

  async handleConnection(socket: Socket, username: string) {

      socket.on('connect', async () => {
        console.log("connected");
        await this.prismaservice.user.update({
            where: {username: username},
            data: {
                state: "Online",
            }
        });
    });


    // socket.on('disconnect', async () => {
    //     await   this.prismaservice.user.update({
    //         where: {username: username},
    //         data: {
    //             state: "Offline",
    //         }
    //     });
    // });

    // async function handleDisconnect(socket: Socket, username: string) {
    //     await   this.prismaservice.user.update({
    //         where: {username: username},
    //         data: {
    //             state: "Offline",
    //         }
    //     });
    // }


    // Handle other events and messages from the client
  }

  // Add more methods for handling events, messages, etc.
}