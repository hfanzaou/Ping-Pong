import { Body, Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService} from './auth.service';
import { AuthDto } from './dto';
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
		return this.authService.signup(dto);
	}
	

	@Get('signin')
	@UseGuards(FTAuthGuard)
	signin() {}

	@Get('callback')
	@UseGuards(FTAuthGuard)
	callback(@Req() req, @Res() res)
	{
		console.log(req.link);
		return req.link;
	}
	// @Post('signin')
	// signin(@Body() dto: AuthDto) {
	// 	return this.authService.signin(dto);
	// }
	
}
