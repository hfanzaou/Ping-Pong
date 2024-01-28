import { Socket } from "socket.io-client";

export interface DATA {
	socket?: Socket,
	userData?: USERDATA,
	talkingTo?: string,
	message: string,
	trigger: boolean,
	send: boolean,
	groupTo?: string,
	password?: boolean
}

export interface User {
	id:		number,
	login:	string,
	avatar?: string,
	time?:	Date,
	read?: boolean,
	state?: string
}

export interface USERDATA {
	userName: string,
	chatUsers: User[],
	friends: User[],
	groups: Group[],
	blocked: User[]
}

export interface MESSAGE extends NEWCHAT {
	message: string
}

export interface NEWCHAT {
	sender: string
	recver: string
}

export interface Group {
	id:			number,
	name:		string,
	size:		boolean,
	password:	boolean,
	banded:		string[],
	muted:		string[],
	time:		Date
}
