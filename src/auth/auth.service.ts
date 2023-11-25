import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, 
				private jwt: JwtService,
				private config: ConfigService) {}
	async signup(dto: AuthDto) {
		// generate pass hash
		const hash = await argon.hash(dto.password);
		//save the new user int the db
		try {
			const user = await this.prisma.user.create({
				data: {
				 email: dto.email,
				 hash,
				},
			});
			delete user.hash;
			//return saved user
			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException('Already taken');
			}
			throw error;
		}
	}

	async signin(dto: AuthDto) {
		//find the user by email
                const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});
                //if does not exist throw an excep
		if (!user) throw new ForbiddenException('incorret credentials');
                //if exist compare password
		const pass = await argon.verify(user.hash, dto.password);
                //if pass incorrect throw excep
		if (!pass) throw new ForbiddenException('incorrect credentials');
		return this.signToken(user.id, user.email);
	}

	async signToken(userId: number, email: string) : Promise<{access_token: string}> {
		const payload = {
			sub: userId,
			email
		}
		const secret = this.config.get('JWT_SECRET');
		const token = await this.jwt.signAsync(payload, {
			expiresIn: '15m',
			secret: secret,
		});
		console.log(token);
		return {
			access_token: token,
		};
	}
}
