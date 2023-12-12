import { Body, Controller, Get, Post, UseGuards, Req, Res, HttpException, HttpStatus, Redirect, HttpCode, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthService} from './auth.service';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { FTUser } from './42dto';
import { FTAuthGuard, JwtGuard } from './guard';
import { Request, Response } from 'express';
import { toFileStream } from 'qrcode';
import JwtTwoFaGuard from './guard/twoFaAuth.guard';
import { throwError } from 'rxjs';

@Controller('')
export class AuthController {

	private authService: AuthService;
	
	constructor(authService: AuthService) {
		this.authService = authService;
	}

	@Get('verify')
  	@UseGuards(JwtTwoFaGuard)
  	verify() {
    	return (true);
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
		const user = await this.authService.validateUser(req.user);
		if (user && user.twoFaAuth)
		{
			const token = this.authService.signToken({sub: user.id, userID: user.id, isTwoFaAuth: false})
			res.cookie('jwt', token, {
				path:'/',
				httpOnly: true,
			});
			res.redirect('http://localhost:3001/2fa/auth');
		}
		const token = await this.authService.signin(req.user);
		console.log("hello");
		res.cookie('jwt', token, {
			path:'/',
			httpOnly: true,
		});

		//res.send('done');
		res.redirect('http://localhost:3000');
	}

	@Get('logout')
	@UseGuards(JwtTwoFaGuard)
	async logout(@Req() req, @Res() res)
	{
		await res.clearCookie('jwt');
		res.redirect('http://localhost:3000')
	}
	
	@Post('2fa/turnon')
	@HttpCode(201)
	@UseGuards(JwtTwoFaGuard)
	async turnOnTwoFaAuth(@Req() req, @Res() res: Response) {
		const otpAuthUrl = await this.authService.generateTwoFA(req.user);
		console.log(otpAuthUrl);
		return ({qrcode: toFileStream(res, otpAuthUrl.oturl)});
	}

	@Post('2fa/auth')
	@UseGuards(JwtGuard)
	async autenticate(@Req() req, @Res() res, @Body() body) {
		console.log(body);
		const user = await this.authService.validateUser(req.user)
		try {
			const isCodeValid = await this.authService.verifyTwoFa(
				user,
				body.AuthCode,
			);
			if (!isCodeValid)
				throw isCodeValid;
		} catch(error) {
			if (typeof error === "boolean") {
				throw new UnauthorizedException('Wrong Verification Code');
			}
			//console.log(body.AuthCode);
		}
		if (!user.twoFaAuth)
			await this.authService.enableTwoFa(user);
		const payload = { sub: user.id, userID: user.id, isTwoFaAuth: true };
		const newToken = await this.authService.signToken(payload);
		res.cookie('jwt', newToken, {
			path: '/',
			httpOnly: true,
		});
		res.send('done');
	}
}
