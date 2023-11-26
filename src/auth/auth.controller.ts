import { Body, Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService} from './auth.service';
import { AuthDto } from './dto';
import { FTUser } from './42dto';
import { FTAuthGuard } from './guard';

@Controller('auth')
export class AuthController {

	//constructor(private authService: AuthService) {}
	//or this
	private authService: AuthService;
	
	constructor(authService: AuthService) {
		this.authService = authService;
	}
	@Post('signup')
	signup(@Body() dto: AuthDto) {
		console.log({
			dto,
		});
	}
	
	@Get('route')
	fun()
	{
		return ('to signin');
	}
	@Get('signin')
	@UseGuards(FTAuthGuard)
	signin() {}

	@Get('callback')
	@UseGuards(FTAuthGuard)
	callback(@Body() dto: FTUser) {
		this.authService.signin(dto);
	}
	// @Post('signin')
	// signin(@Body() dto: AuthDto) {
	// 	return this.authService.signin(dto);
	// }
	
}
