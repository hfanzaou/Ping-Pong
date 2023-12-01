import { Body, Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService} from './auth.service';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { AuthDto } from './dto';
import { FTUser } from './42dto';
import { FTAuthGuard } from './guard';
import axios from 'axios';

@Controller('')
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
	@Get('login')
	@UseGuards(FTAuthGuard)
	signin(@Body() user: any) {
		console.log("hello");
	}

	@Get('callback')
	@UseGuards(FTAuthGuard)
	callback(@GetUser() user: User) {
		console.log(user);
		return this.authService.signin(user);
	}

	@Get('pic')
	async ft_pic(@Req() req, @Res() res)
	{
		//const file = await axios.get("https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630");
		res.redirect("https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630");
	}
	// @Post('signin')
	// signin(@Body() dto: AuthDto) {
	// 	return this.authService.signin(dto);
	// }
	
}
