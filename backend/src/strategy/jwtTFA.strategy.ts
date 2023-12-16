import { Injectable, UnauthorizedException, Req } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { ConfigService } from "@nestjs/config";
import { Request } from 'express';
import { PrismaService } from "src/prisma/prisma.service";
@Injectable()
export class JwtTwoFaStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([JwtTwoFaStrategy.extractJWT]),
            secretOrKey: config.get('JWT_SECRET')
        })
    }
    private static extractJWT(@Req() req: Request): string | null {
        return req.cookies['jwt'];
    }
    
    async validate(payload: {sub: number, userID: number, isTwoFaAuth: boolean}) {

        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
        if (!user) {
            throw new UnauthorizedException()
        }
        if (!user.twoFaAuth || payload.isTwoFaAuth) {
            return user;
        }
        ////console.log();
    }
} 