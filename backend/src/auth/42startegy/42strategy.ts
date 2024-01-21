import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { FTUser } from "../42dto";
import { achDto } from "../dto";
const Strategy = require('passport-42').Strategy;

@Injectable()
export class FTAuth extends PassportStrategy(Strategy, '42') {
    constructor(config: ConfigService) {
        super ({
            clientID: config.get('CLIENTID'),
            clientSecret: config.get('CLIENTSECRET'),
            callbackURL: config.get('CALLBACK_URL'),
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
            achievement : achDto,
        }
        ////console.log(user);
        return (user || null);
    }
}