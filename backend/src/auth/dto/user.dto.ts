import { IsEmail, IsNotEmpty, IsString } from "class-validator"; 

export class userDto {
	key: number;
	name: string;
	avatar: string;
	state: boolean;
}
