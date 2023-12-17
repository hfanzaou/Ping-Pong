import { AuthGuard } from '@nestjs/passport';

export class FTAuthGuard extends AuthGuard('42') {
    constructor() {
        super();
    }
}