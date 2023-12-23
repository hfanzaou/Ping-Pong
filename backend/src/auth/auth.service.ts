import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { FTUser } from './42dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt'
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { Path } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import * as speakeasy from 'speakeasy';
import { IsBase32 } from 'class-validator';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, 
				private jwt: JwtService,
				private config: ConfigService) {}
	
	//42 api
	async signup(dto: FTUser)
	{
		console.log('------------');
		try {
			const input: Prisma.UserCreateInput = dto;
			console.log(input);
			const user = await this.prisma.user.create({
				data: input, 
			});
			// fetch(user.avatar)
			//   .then((response) => response.buffer())
			//   .then((buffer) => {
			// 	createWriteStream(path.join('../img/', user.id + '.png'), buffer);
			//   });
			return user;
		}
		catch (error) {
			console.log(error);
			throw 'error creating user';
		}
	}			
	async signin(user: FTUser)
	{
        let finduser = await this.prisma.user.findUnique({
			where: {
				email: user.email,
			},
		});
		if (!finduser) {
			finduser = await this.signup(user);
		}
		const payload = {
			sub: finduser.id,
			userID: finduser.id,
			isTwoFaAuth: finduser.twoFaAuth,
		}
		const token = await this.signToken(payload);
		return (token);
	}	

	async signToken(payload: {sub: number, userID: number, isTwoFaAuth: boolean}) : Promise<string> {
		const secret = this.config.get('JWT_SECRET');
		const token = await this.jwt.signAsync(payload, {
			//expiresIn: '15m',
			secret: secret,
		});
		console.log('console in signToken');
		console.log(token);
		//console.log(token);
		return (token);
	}

	async validateUser(user: any)
	{
        let finduser = await this.prisma.user.findUnique({
			where: {
				id: user.id,
				email: user.email,
			},
		});
		return (finduser || null);
	}
	///////TWO FACTOR AUTH////////
	async enableTwoFa(user: any)
	{
		await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				twoFaAuth: true
			}
		});
	}
	async generateTwoFA(user: any) {
		const finduser = await this.validateUser(user);
		if (!finduser)
			throw new NotFoundException('User not found');
		const secret = await speakeasy.generateSecret();
		await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				twoFaSecret: secret.base32,
			}
		})
		const otpauthUrl = await speakeasy.otpauthURL({
			secret: secret.ascii,
			label: 'PongTFA',
			issuer: 'Auth',
			algorithm: 'sha1', 
		});
		return ({secret: secret.otpauth_url, oturl: otpauthUrl});
	}

	
	async verifyTwoFa(user: any, token: string): Promise<boolean> {
		const finduser = await this.validateUser(user);
		console.log(user.twoFaSecret);
		console.log("UserSecret = " + finduser.twoFaSecret);
		console.log("AuthCode = " + token);
		const secret = finduser.twoFaSecret;
		const isItValid = await speakeasy.totp.verify({
			secret: secret,
			encoding: 'base32',
			token: token
		});
		return isItValid;
	}

	async login2fa(payload: { sub: number, userID: number, isTwoFaAuth: boolean }) {
		const token = await this.signToken(payload);
		return (token);
	}

	// async generateTFAuth(user: any) {
	// 	const secret = authenticator.generateSecret();
	// 	const otpUrl = authenticator.keyuri(user.id, 'google_auth', secret);
	// 	return {
	// 		secret,
	// 		otpUrl
	// 	}
	// }

	// async setTwoFaAuthSecret(secret: string, userId: number) {
	// 	const updateUser = await this.prisma.user.update({
	// 		where: {
	// 			id: userId,
	// 		},
	// 		data: {
	// 			twoFaSecret: secret,
	// 		}
	// 	})
	// }

	// async generateQrCode(otpUrl: string) {
	// 	return toDataURL(otpUrl);
	// }
	// async generateTwoFaAuth(user: any)
	// {
	// 	const secretandotp = await this.generateTFAuth(user);
	// 	const otpAuthUrl = await this.generateQrCode(secretandotp.otpUrl);
	// 	await this.setTwoFaAuthSecret(secretandotp.secret, user.id);
	// 	return(otpAuthUrl);
	// } 

	// async turnOnTwoFaAuth(userId: number)
	// {
	// 	const updateUser = await this.prisma.user.findUnique({
	// 		where: {
	// 			id: userId,
	// 		}
	// 	})
	// 	let ONorOFF = true;

	// 	if (updateUser.twoFaAuth)
	// 		ONorOFF = false;

	// 	await this.prisma.user.update({
	// 		where: {
	// 			id: userId,
	// 		},
	// 		data: {
	// 			twoFaAuth: ONorOFF,
	// 		}
	// 	})
	// }
	// async isTwoFaAuthCodeValid(twoFaAuthCode: string, user: any)
	// {
	// 	console.log(user.twoFaSecret);
	// 	return authenticator.verify({
	// 		token: twoFaAuthCode,
	// 		secret: user.twoFaSecret
	// 	})
	// }
}