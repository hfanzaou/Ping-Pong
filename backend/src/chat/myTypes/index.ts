import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class User {
	@IsNumber()
	@IsNotEmpty()
	id:		number;
	@IsNotEmpty()
	@IsString()
	login:	string;
}

export class USERDATA {
	@IsNotEmpty()
	@IsString()
	userName: string;
	chatUsers: User[];
	friends: User[];
	groups: Group[];
	blocked: User[];
}

export class NEWCHAT {
	@IsNotEmpty()
	@IsString()
	sender: string;
	@IsNotEmpty()
	@IsString()
	recver: string;
}

export class MESSAGE extends NEWCHAT {
	@IsNotEmpty()
	@IsString()
	message: string;
}

export class NEWGROUP {
	@IsNotEmpty()
	@IsString()
	name: string;
	@IsNotEmpty()
	@IsString()
	state: string;
	@IsString()
	password: string;
	@IsNotEmpty()
	@IsString()
	owner: string;
}

class Group {
	@IsNotEmpty()
	@IsNumber()
	id:		number;
	@IsNotEmpty()
	@IsString()
	name:	string;
}

export class userName {
	@IsNotEmpty()
	@IsString()
	userName: string;
}

export class socket {
	@IsNotEmpty()
	@IsString()
	socket: string;
	@IsNotEmpty()
	@IsString()
	username: string;
}

export class name {
	@IsNotEmpty()
	@IsString()
	userName: string;
	@IsNotEmpty()
	@IsString()
	name: string
}

export class password {
	@IsNotEmpty()
	@IsString()
	name: string;
	@IsString()
	password: string
}

export class sender {
	@IsNotEmpty()
	@IsString()
	name: string;
	@IsNotEmpty()
	@IsString()
	userName: string;
	@IsNotEmpty()
	@IsString()
	sender: string
}

export class old {
	@IsString()
	name: string;
	@IsString()
	old: string;
	@IsString()
	password: string;
	@IsString()
	oldName: string;
	@IsString()
	userName: string;
}

export class userName1 {
	@IsNotEmpty()
	@IsString()
	userName1: string;
	@IsNotEmpty()
	@IsString()
	userName2: string;
}
