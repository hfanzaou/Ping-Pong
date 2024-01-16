import { Injectable, UnauthorizedException, Req } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { ConfigService } from "@nestjs/config";
import { Request } from 'express';
import { PrismaService } from "src/prisma/prisma.service";
import * as jwt from "jsonwebtoken";
@Injectable()
export class JwtTwoFaStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
    // config: ConfigService;
    constructor(private config: ConfigService, private prisma: PrismaService) {
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
    async verifyToken(token: string) {
        try {
            const secret = await this.config.get("JWT_SECRET");
          const payload: any = jwt.verify(token, secret)
          // You can perform additional logic with the decoded payload if needed
          return payload;
        } catch (error) {
            //console.log(error);
          throw new UnauthorizedException('Invalid token');
        }
    }
} 