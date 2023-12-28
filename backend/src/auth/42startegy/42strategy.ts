import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { FTUser } from "../42dto";
const Strategy = require('passport-42').Strategy;

@Injectable()
export class FTAuth extends PassportStrategy(Strategy, '42') {
    constructor(config: ConfigService) {
        super ({
            clientID: config.get('42_CLIENTID'),
            clientSecret: config.get('42_CLIENTSECRET'),
            callbackURL: 'http://localhost:3001/callback',
        });
    }
    validate(accessToken: string, refreshToken: string, profile: any) {
        const user: FTUser = {
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            username: profile.username,
            avatar: profile._json.image.link,
            twoFaAuth: false,
            achievement: {
                achievement1: false, 
                achievement2: false,
                achievement3: false,
                achievement4: false,
                achievement5: false
            }
        }
        ////console.log(user);
        return (user || null);
    }
}