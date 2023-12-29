export interface USERSOCKET {
	socket: string
}

export interface User {
	id:		number,
	login:	string
}

export interface USERDATA {
	userName: string,
	chatUsers: User[]
}

export interface MESSAGE extends NEWCHAT {
	message: string
}

export interface NEWCHAT {
	sender: string
	recver: string
}
