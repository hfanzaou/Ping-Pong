import { Body, Controller, Get, Post, UseGuards, Req, Res, HttpException, HttpStatus, Redirect, HttpCode } from '@nestjs/common';
import { AuthService} from './auth.service';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { AuthDto } from './dto';
import { FTUser } from './42dto';
import { FTAuthGuard, JwtGuard } from './guard';
import { Request, Response } from 'express';
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
		res.cookie('jwt', token, {
			path:'/',
			httpOnly: true,
		});
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
	
	@Post('2fa/turnon')
	@HttpCode(201)
	@UseGuards(JwtTwoFaGuard)
	async turnOnTwoFaAuth(@Req() req, @Res() res: Response, @Body() body) {
		const otpAuthUrl = await this.authService.generateTwoFA(req.user);
		console.log(otpAuthUrl);
		return (toFileStream(res, otpAuthUrl.oturl));
	}

	@Post('2fa/auth')
	@UseGuards(JwtTwoFaGuard)
	async autenticate(@Req() req, @Res() res, @Body() body) {
		const user = await this.authService.validateUser(req.user)
		try {
			const isCodeValid = await this.authService.verifyTwoFa(
				user,
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
		//console.log('here');
		if (!user.twoFaAuth)
			await this.authService.enableTwoFa(user);
		const payload = { sub: user.id, userID: user.id, isTwoFaAuth: true };
		const newToken = await this.authService.signToken(payload);
		console.log(newToken);
		res.cookie('jwt', newToken, {
			path: '/',
			httpOnly: true,
		});
		res.send('done'); 	
	}
}
