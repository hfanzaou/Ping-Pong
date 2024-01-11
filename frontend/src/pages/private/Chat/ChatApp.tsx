import React, { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Private from "./components/Private";
import Chat from "./components/Chat";
import { DATA } from "./myTypes";
import { Socket, io } from "socket.io-client";
import { setSocket, setUserData } from "./utils";
import Groups from "./components/Groops";

interface Props {
	socket: Socket
}

const ChatApp: React.FC<Props> = ({ socket }) => {
	const	[data, setData] = useState<DATA>({
		message: "",
		trigger: true,
		send: true
	});
	const	[option, setOption] = useState("Rooms");
	
	// async function callBack(socket: Socket) {
		useEffect(() => {
			async function fetchData() {
				setData(prev => setSocket(prev, socket));
				try {
					const res0 = await fetch("http://localhost:3001/user/name", {
						credentials: "include"
					});
					const Data0 = await res0.json();
					// console.log(Data0.name)
					if (Data0.name)
					{
						try {
							// console.log(Data0.name)
							const res = await fetch("http://localhost:3001/chatUser", {
								method: "POST",
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									userName: Data0.name
								})
							});
							const Data = await res.json();
							setData(prev => setUserData(prev, Data));
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
			fetchData();
		}, [])
	// }
	// useEffect(() => {
		// console.log(document.cookie)
		// const	socket = io("http://localhost:3001", {
		// 	withCredentials: true
		// })
		// socket.on("connect", async () => {
		// 	await callBack(socket);
		// })
		// return () => {
		// 	socket.off("connect", async () => {
		// 		await callBack(socket);
		// 	})
		// }
	// }, []);
	return (
		<div className="flex h-[80vh]">
			<Nav option={option} setOption={setOption} setData={setData}/>
			{
				option == "Private" ?
					<Private
						data={data}
						setData={setData}
					/> : 
					<Groups
						data={data}
						// setData={setData}
					/>
			}
			<Chat
				data={data}
				setData={setData}
			/>
		</div>
	)
}

export default ChatApp;
