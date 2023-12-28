import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { SockGateway } from './sock.gateway';
import { AuthService } from 'src/auth/auth.service';
import JwtTwoFaGuard from 'src/auth/guard/twoFaAuth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers: [GatewayController],
    providers: [GatewayService, SockGateway, AuthService, JwtTwoFaGuard, JwtService]
})
export class GatewayModule {}
