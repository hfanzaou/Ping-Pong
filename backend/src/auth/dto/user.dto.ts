import { IsEmail, IsNotEmpty, IsString } from "class-validator"; 

export class userDto {
	level: number;
	name: string;
	avatar: string;
	state: string;
}
