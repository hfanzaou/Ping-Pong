import { Body, Controller, Get, Post, UseGuards, Req, Res, HttpException, HttpStatus, Redirect, HttpCode } from '@nestjs/common';
import { AuthService} from './auth.service';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { AuthDto } from './dto';
import { FTUser } from './42dto';
import { FTAuthGuard, JwtGuard } from './guard';
import { Request } from 'express';
import { toFileStream } from 'qrcode';
import JwtTwoFaGuard from './guard/twoFaAuth.guard';

@Controller('')
export class AuthController {

	private authService: AuthService;
	
	constructor(authService: AuthService) {
		this.authService = authService;
	}

	@Get('verify')
  	@UseGuards(JwtGuard)
  	verify() {
    	return 'TRUE';
  	}

	// @Post('signup')
	// signup(@Body() dto: AuthDto) {
	// 	console.log({
	// 		dto,
	// 	});
	// }
	
	@Get('login')
	@UseGuards(FTAuthGuard)
	signin(@Body() user: any) {
		//console.log("hello");
	}

	@Get('callback')
	@UseGuards(FTAuthGuard)
	async callback(@Req() req, @Res() res) {
		const token = await this.authService.signin(req.user);
		console.log("hello");
		res.cookie('jwt', token.token);
		res.send('done');
		//res.redirect('http://localhost:3001');
	}

	@Get('logout')
	@UseGuards(JwtTwoFaGuard)
	async logout(@Req() req, @Res() res)
	{
		await res.clearCookie('jwt');
		res.redirect('http://localhost:3001')
	}

	// @Get('generate-qr')
	// @UseGuards(JwtGuard)
	// async generateQrCode(@Req() req)
	// {
	// 	//const user = this.authService.validateUser(req.user);
	// 	const otpAuthUrl = await this.authService.generateTwoFaAuth(req.user);
	// 	//res.setHeader('content-type', 'image/png');
	// 	return (otpAuthUrl);
	// }

	@Post('2fa/turnon')
	@HttpCode(201)
	@UseGuards(JwtGuard)
	async turnOnTwoFaAuth(@Req() req, @Body() body) {
		// const user = this.authService.validateUser(req.user)
		// const isCodeValid = this.authService.isTwoFaAuthCodeValid(
		// 	body.twoFaAuthCode,
		// 	req.user
		// );
		// if (!isCodeValid)
		// 	throw new HttpException('Wrong authentication code', HttpStatus.UNAUTHORIZED);
		const otpAuthUrl = await this.authService.enableTwoFA(req.user);
		//const toFile = await toFileStream(res, otpAuthUrl);
		
		return (otpAuthUrl)
		//return ('done');	
	}

	@Post('2fa/auth')
	@UseGuards(JwtGuard)
	async autenticate(@Req() req, @Body() body) {
		try {
			const user = await this.authService.validateUser(req.user)
			const isCodeValid = await this.authService.verifyTwoFa(
				req.user,
				body.AuthCode,
			);
			console.log("AuthCode = " + body.AuthCode);
			//console.log(req.user.twoFaSecret)
			//console.log(body.twoFaAuthCode);
			if (!isCodeValid)
				throw 'error';
		} catch(error) {
			throw new HttpException('Wrong authentication code', HttpStatus.UNAUTHORIZED)
		}
		console.log('here');
		return(this.authService.login2fa(req.user)); 	
	}
}
