import { Socket } from "socket.io-client";

export interface DATA {
	socket?: Socket,
	userData?: USERDATA,
	talkingTo?: string,
	message: string,
	trigger: boolean,
	send: boolean,
	groupTo?: string
}

export interface User {
	id:		number,
	login:	string,
	avatar?: string,
}

export interface USERDATA {
	userName: string,
	chatUsers: User[],
	friends: User[],
	groups: Group[]
}

export interface MESSAGE extends NEWCHAT {
	message: string
}

export interface NEWCHAT {
	sender: string
	recver: string
}

export interface Group {
	id:		number,
	name:	string,
	size:	boolean
}
