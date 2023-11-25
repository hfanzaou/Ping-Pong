import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-42';
@Injectable()
export class FTAuth extends PassportStrategy(Strategy, '42') {
    constructor(config: ConfigService) {
        super ({
            clientID: config.get('42_CLIENTID'),
            clientSecret: config.get('42_CLIENTSECRET'),
            callbackURL: 'http://localhost:3000/auth/callback',
        });
    }
    validate(accesToken: string, refreshToken: string, profile: any) {
        console.log(profile._json.image.link);
        return profile._json.image.link;
    }
}