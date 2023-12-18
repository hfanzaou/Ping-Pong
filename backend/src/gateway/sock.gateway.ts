import { Req, UseGuards } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import JwtTwoFaGuard from "src/auth/guard/twoFaAuth.guard";
import { Server } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "src/prisma/prisma.service";

@WebSocketGateway({
    origin: 'http://localhost:3000', 
    credentials: true
})
@UseGuards(JwtTwoFaGuard)
export class SockGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private authservice: AuthService, private prisma: PrismaService)
    {
    }
    @WebSocketServer() server: Server
    afterInit(server: Server) {
        console.log('WebSocket Gateway initialized');
    }
      
    async handleConnection(@Req() req) {
        console.log("hello");
        const user = await this.authservice.validateUser(req.user);
        await this.prisma.user.update({
            where : {
                id: user.id,
            }, data: {
                state: 'Online',
            }
        })
        
    }
    
    async handleDisconnect(@Req() req) {
        const user = await this.authservice.validateUser(req.user);
        await this.prisma.user.update({
            where : {
                id: user.id,
            }, data: {
                state: 'Offline',
            }
        })
    }

}