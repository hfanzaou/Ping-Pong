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

	@Get('verifyTfa')
	@UseGuards(JwtGuard)
	async verifyTwoFa(@Req() req) {
        const user = await this.authService.validateUser(req.user);
        if (user && user.twoFaAuth)
            return (true);
        return false;
    }
	// @Post('signup')
	// signup(@Body() dto: AuthDto) {
	// 	({
	// 		dto,
	// 	});
	// }
	
	@Get('login')
	@UseGuards(FTAuthGuard)
	signin(@Body() user: any) {
		//("hello");
	}

	@Get('callback')
	@UseGuards(FTAuthGuard)
	async callback(@Req() req, @Res({passthrough: true}) res: Response) {
		const user = await this.authService.validateUser(req.user);
		//console.log(user.twoFaAuth);
		if (user && user.twoFaAuth)
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
		if (!user)
		{
			res.redirect('http://localhost:3000/setting');
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
	
	@Post('2fa/turnon')
	@HttpCode(201)
	@UseGuards(JwtTwoFaGuard)
	async turnOnTwoFaAuth(@Req() req) {
		const otpAuthUrl = await this.authService.generateTwoFA(req.user);
		const qrfile = await toBuffer(otpAuthUrl.oturl);
		return ("data:image/png;base64," + qrfile.toString('base64'));
	}
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
			//(body.AuthCode);
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
		// await res.clearCookie('jwt');
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
