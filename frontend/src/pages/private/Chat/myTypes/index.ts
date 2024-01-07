import { Socket } from "socket.io-client";

export interface DATA {
	socket?: Socket,
	userData?: USERDATA,
	talkingTo?: string,
	message: string,
	trigger: boolean
}

export interface User {
	id:		number,
	login:	string,
	avatar?: string
}

export interface USERDATA {
	userName: string,
	chatUsers: User[],
	friends: User[]
}

export interface MESSAGE extends NEWCHAT {
	message: string
}

export interface NEWCHAT {
	sender: string
	recver: string
}
