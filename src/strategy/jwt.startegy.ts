import { Injectable, Req } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { PrismaService } from "../prisma/prisma.service";
import { Request } from 'express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
            // jwtFromRequest: cookieExtractor(),
            secretOrKey: config.get('JWT_SECRET'),
            
        });
    }
    private static extractJWT(@Req() req: Request): string | null {
        return req.cookies['jwt'];
      }
    async validate(payload: {sub: number, userID: number}, @Req() req) {
        //console.log("cookie =" + req.cookie)
        // console.log(payload);
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
       //console.log(user.email);
        //console.log(payload);
        return user;
    }
}