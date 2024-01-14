import { Redirect, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class FTAuthGuard extends AuthGuard('42') {
    constructor() {
        super();
    }
    handleRequest(err, user, info): any {
        if (err || !user) {
            return(null);
        }
        return user;
    }
}