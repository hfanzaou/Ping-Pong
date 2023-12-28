import { BlobOptions } from "buffer";

export class FTUser {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
    twoFaAuth: boolean;
    achievement: {achievement1: boolean, achievement2: boolean,achievement3: boolean,achievement4: boolean,achievement5: boolean}
}