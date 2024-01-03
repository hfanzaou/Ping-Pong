import { Body, Controller, Get, Post, UseGuards, Req, Res, HttpException, HttpStatus, Redirect, HttpCode, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthService} from './auth.service';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { FTUser } from './42dto';
import { FTAuthGuard, JwtGuard } from './guard';
import { Request, Response } from 'express';
import { toBuffer, toFileStream } from 'qrcode';
import JwtTwoFaGuard from './guard/twoFaAuth.guard';
import { throwError } from 'rxjs';
import { FTAuth } from './42startegy';
import { AuthDto, FAuthDto } from './dto';

@Controller('')
export class AuthController {

	private authService: AuthService;
	
	constructor(authService: AuthService) {
		this.authService = authService;
	}

	@Post('signup/pass')
	@HttpCode(201)
	async signupPass(@Res() res, @Body() body: FAuthDto) {
		const token = await this.authService.signupPass(body);
		res.cookie('jwt', token, {
			path:'/',
			httpOnly: true,
		});
		res.send('done');
	}
	@Post('login/pass')
	@HttpCode(201)
	async loginPass(@Res() res, @Body() body: AuthDto) {

		const user = await this.authService.validateUserWithPass(body);
		if (user && user.twoFaAuth) ///2fa enabled need an access token that only enables to verify code
		{
			const token = await this.authService.signToken({sub: user.id, userID: user.id, isTwoFaAuth: false})
			res.cookie('jwt', token, {
				path:'/',
				httpOnly: true,
			});
			res.send({"2fa": true});
			return;
		}
		const token = await this.authService.signToken({sub: user.id, userID: user.id, isTwoFaAuth: false})
		res.cookie('jwt', token, {
			path:'/',
			httpOnly: true,
		});
		//res.redirect('http://localhost:3000');
		res.send({"2fa": false});
	}
	/////to verify user token////
	
	@Get('verify')
  	@UseGuards(JwtTwoFaGuard)
  	verify() {
    	return (true);
  	}
	///to verify user in login if 2fa is enabled////
	@Get('verifyTfa')
	@UseGuards(JwtGuard)
	async verifyTwoFa(@Req() req) {
        const user = await this.authService.validateUser(req.user);
        if (user && user.twoFaAuth)
            return (true);
        return false;
    }
	////// login logout and callback////
	@Get('login')
	@UseGuards(FTAuthGuard)
	signin() {
		//("hello");
	}

	@Get('callback')
	@UseGuards(FTAuthGuard)
	async callback(@Req() req, @Res({passthrough: true}) res: Response) {
		const user = await this.authService.validateUser(req.user);
		//console.log(user.twoFaAuth);
		if (user && user.twoFaAuth) ///2fa enabled need an access token that only enables to verify code
		{
			const token = await this.authService.signToken({sub: user.id, userID: user.id, isTwoFaAuth: false})
			res.cookie('jwt', token, {
				path:'/',
				httpOnly: true,
			});
			res.redirect('http://localhost:3000/auth');
			return;
		}
		const token = await this.authService.signin(req.user);
		res.cookie('jwt', token, {
			path:'/',
			httpOnly: true,
		});
		if (!user) ///if user first time login
		{
			res.redirect('http://localhost:3000/Setting');
			return;
		}
		res.redirect('http://localhost:3000');
	}

	@Get('logout')
	@UseGuards(JwtTwoFaGuard)
	async logout(@Req() req, @Res() res)
	{
		await res.clearCookie('jwt');
		res.redirect('http://localhost:3000')
	}
	///turn on 2fa and genrate qr code/////
	@Post('2fa/turnon')
	@HttpCode(201)
	@UseGuards(JwtTwoFaGuard)
	async turnOnTwoFaAuth(@Req() req) {
		const otpAuthUrl = await this.authService.generateTwoFA(req.user);
		const qrfile = await toBuffer(otpAuthUrl.oturl);
		return ("data:image/png;base64," + qrfile.toString('base64'));
	}
	/////turn off 2fa/////
	@Post('2fa/turnoff')
	@HttpCode(201)
	@UseGuards(JwtTwoFaGuard)
	async turnOffTwoFaAuth(@Req() req, @Res({passthrough: true}) res, @Body() body) {
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
		}
		if (user.twoFaAuth)
			await this.authService.disableTwoFa(user);
		const payload = { sub: user.id, userID: user.id, isTwoFaAuth: false };
		const newToken = await this.authService.signToken(payload);
		res.cookie('jwt', newToken, {
			path: '/',
			httpOnly: true,
		});
		res.send('done');
	}
	////2fa auth code verification////
	@Post('2fa/auth')
	@HttpCode(201)
	@UseGuards(JwtGuard)
	async autenticate(@Req() req, @Res({passthrough: true}) res, @Body() body) {
		console.log('AuthCode = ', body.AuthCode)
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
		}
		const payload = { sub: user.id, userID: user.id, isTwoFaAuth: true };
		const newToken = await this.authService.signToken(payload);
		res.cookie('jwt', newToken, {
			path: '/',
			httpOnly: true,
		});
		if (!user.twoFaAuth) {
			await this.authService.enableTwoFa(user);
		}
		res.send('done');
	}
}
