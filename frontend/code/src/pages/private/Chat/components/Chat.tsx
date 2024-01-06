import { ActionIcon } from "@mantine/core";
import { IconPingPong, IconSend2 } from "@tabler/icons-react";
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { DATA, MESSAGE } from "../myTypes";
import { setMessageData } from "../utils";

interface Props {
	data: DATA,
	setData: React.Dispatch<React.SetStateAction<DATA>>
	avatar: string
}

const Chat: React.FC<Props> = ({ data, setData, avatar }) => {
	const	[conversation, setConversation] = useState<Array<{
		id: number,
		message: string,
		sender: string,
		avatar: string
	}>>([]);
	const	Reference = useRef<HTMLInputElement | null>(null);
	
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch("http://localhost:3001/chathistory", {
					method: "POST",
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						sender: data.userData?.userName,
						recver: data.talkingTo
					})
				});
				const Data = await res.json()
				if (Data)
					setConversation(Data)
				else
					throw new Error("error")
			}
			catch {
				setConversation([]);
				return ;
			}
		}
		fetchData();
	}, [data])
	function callBack(m: {
		id: number,
		message: string,
		sender: string,
		avatar: string
	})
	{
		setConversation(prev => [m, ...prev]);
	}
	useEffect(() => {
		data.socket?.on("client", callBack);
		return (() => {
			data.socket?.off("client", callBack);
		})
	}, [data.socket])
	function submit(event: FormEvent<HTMLFormElement>)
	{
		event.preventDefault();
		console.log(data);
		const	Message: MESSAGE = {
			sender: data.userData ? data.userData.userName : "",
			recver: data.talkingTo ? data.talkingTo: "",
			message: data.message
		}
		data.socket?.emit("server", Message);
		setData(prev => setMessageData(prev, ""))
		if (Reference.current)
			Reference.current.focus();
	}
	function change(event: ChangeEvent<HTMLInputElement>)
	{
		setData(prev => setMessageData(prev, event.target.value))
	}
	return (
		<form onSubmit={submit} className="w-screen bg-discord4 p-2 flex flex-col justify-end text-discord6">
			<ul className="max-h-90 overflow-auto flex flex-col-reverse">
				{conversation.map(x => {
					return (
						<li
							key={x.id}
							className="flex hover:bg-discord3 rounded-md m-2 p-3"
						>
							<img
								src={x.avatar}
								className="h-12 w-12 rounded-full mr-3"
							/>
							<div>
								<div className="font-extrabold">{x.sender}</div>
								<div className="w-96 break-words">{x.message}</div>
							</div>
						</li>)
				})}
			</ul>
			<div className="flex">
				<input
					type="text"
					placeholder="Message..."
					className="bg-discord1 border-none outline-none w-full h-10 rounded-md mr-2 p-5"
					onChange={change}
					value={data.message}
					autoFocus
					ref={Reference}
				/>
				<button
					className="bg-discord1 w-10 h-10 rounded-md flex
						justify-center items-center"
					type="submit"
				>
					{ data.message.length ? <IconSend2 /> : <IconPingPong/>}
				</button>
			</div>
		</form>
	);
}
export default Chat;
