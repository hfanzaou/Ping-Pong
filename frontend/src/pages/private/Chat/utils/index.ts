import { Socket } from "socket.io-client";
import { DATA, USERDATA } from "../myTypes";

export function setSocket(prev: DATA, socket: Socket): DATA
{
	return {
		...prev,
		socket: socket
	}
}

export function setUserData(prev: DATA, data: USERDATA):DATA {
	return {
		...prev,
		userData: data
	}
}

export function setMessageData(prev: DATA, message: string):DATA {
	return {
		...prev,
		message: message
	}
}
