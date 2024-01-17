import { AuthGuard } from "@nestjs/passport";

export class JwtGuard extends AuthGuard('jwt') {
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