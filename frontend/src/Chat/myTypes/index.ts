import { Socket } from "socket.io-client";

export interface DATA {
	socket?: Socket,
	userData?: USERDATA,
	talkingTo?: string
}

export interface User {
	id:		number,
	login:	string
}

export interface USERDATA {
	userName: string,
	chatUsers: User[]
}
