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