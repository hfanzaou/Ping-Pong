import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategy';
import { FTAuth } from './42startegy';
import JwtTwoFaGuard from './guard/twoFaAuth.guard';

@Module({
	imports: [PrismaModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, FTAuth, JwtTwoFaGuard],
})

export class AuthModule {}