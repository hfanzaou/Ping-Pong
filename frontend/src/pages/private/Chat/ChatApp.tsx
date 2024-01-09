import React, { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Private from "./components/Private";
import Chat from "./components/Chat";
import { DATA } from "./myTypes";
import { Socket, io } from "socket.io-client";
import { setSocket, setUserData } from "./utils";
import Header from "../../../Layout/Header/Header";

const ChatApp = ({avatar}: {avatar: string}) => {
	const	[data, setData] = useState<DATA>({
		message: "",
		trigger: true,
		send: true
	});
	const	[option, setOption] = useState("Private");
	
	async function callBack(socket: Socket) {
		setData(prev => setSocket(prev, socket));
		try {
			const res0 = await fetch("http://localhost:3001/user/name", {
				credentials: "include"
			});
			const Data0 = await res0.json();

			if (Data0.name)
			{
				try {
					const res = await fetch("http://localhost:3001/chatUser", {
						method: "POST",
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							socket: socket.id,
							username: Data0.name
						})
					});
					const Data = await res.json();
					setData(prev => setUserData(prev, Data));
					// console.log("here");
				}
				catch {
					throw new Error("error");
				}
			}
		}
		catch {
			return ;
		}
	}
	useEffect(() => {
		const	socket = io("http://localhost:3001");
		socket.on("connect", async () => {
			await callBack(socket);
		})
		return () => {
			socket.disconnect();
			socket.off("connect", async () => {
				await callBack(socket);
			})
		}
	}, []);
	return (
		<div className="flex h-[80vh]">
			<Nav option={option} setOption={setOption}/>
			<Private
				data={data}
				setData={setData}
				/>
			<Chat
				data={data}
				setData={setData}
				avatar={avatar}
			/>
		</div>
	)
}

export default ChatApp;
