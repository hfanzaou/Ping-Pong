import { ActionIcon } from "@mantine/core";
import { IconPingPong, IconSend2, IconUser } from "@tabler/icons-react";
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { DATA, MESSAGE, USERDATA } from "../myTypes";
import { setMessageData, setUserData } from "../utils";

interface Props {
	data: DATA,
	setData: React.Dispatch<React.SetStateAction<DATA>>
}

const ChatPrivate: React.FC<Props> = ({ data, setData }) => {
	const	[conversation, setConversation] = useState<Array<{
		id: number,
		message: string,
		sender: string
		// avatar: string
	}>>([]);
	const	dataRef = useRef(data);
	dataRef.current = data;
	const	Reference = useRef<HTMLInputElement | null>(null);
	const	[trigger, setTrigger] = useState(false);
	const	[avatars, setAvatars] = useState<Array<{
		userName: string,
		avatar: string
	}>>([]);

	useEffect(() => {
		async function fetchData() {
			const	res = await fetch("http://localhost:3001/chatAvatarPrivate", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userName1: data.userData?.userName,
					userName2: data.talkingTo
				})
			});
			const	Data = await res.json();
			if (Data)
				setAvatars(Data);
		}
		fetchData();
	}, [data.talkingTo]);
	useEffect(() => {
		if (Reference.current)
			Reference.current.focus();
	}, [data.talkingTo])
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch("http://localhost:3001/chathistoryPrivate", {
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
	}, [data]);
	useEffect(() => {
		if (trigger) {
			async function fetchData() {
				if (data.talkingTo) {
					await fetch("http://localhost:3001/chatUsers", {
						method: "POST",
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							sender: data.userData?.userName,
							recver: data.talkingTo,
						})
					});
					setData(prev => ({
						...prev,
						trigger: !prev.trigger
					}))
				}
				const res0 = await fetch("http://localhost:3001/chatUser", {
						method: "POST",
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							userName: data.userData?.userName
						})
					});
					const Data: USERDATA = await res0.json();
					Data.chatUsers.sort((x, y) => {
						// console.log("here");
						if (x.time && y.time) {
							const	timeX = new Date(x.time);
							const	timeY = new Date(y.time);
							return timeY.getTime() - timeX.getTime();
						}
						return 0;
					})
					setData(prev => setUserData(prev, Data));
					data.socket?.emit("newUser", data.talkingTo)
			}
			fetchData()
			setTrigger(false);
		}
	}, [trigger])
	function callBack(m: {
		id: number,
		message: string,
		sender: string
		// avatar: string,
	})
	{
		setData(x => ({
			...x,
			send: !x.send
		}))
		// if (!dataRef.current.userData?.chatUsers.
		// 	find(x => x.login == dataRef.current.talkingTo)) {
			setTrigger(true);

		// }
		setConversation(prev => [m, ...prev]);
	}
	useEffect(() => {
		data.socket?.on("clientPrivate", callBack);
		return (() => {
			data.socket?.off("clientPrivate", callBack);
		})
	}, [data.socket])
	function submit(event: FormEvent<HTMLFormElement>)
	{
		event.preventDefault();
		if (data.message.length) {
			const	Message: MESSAGE = {
				sender: data.userData ? data.userData.userName : "",
				recver: data.talkingTo ? data.talkingTo: "",
				message: data.message
			}
			data.socket?.emit("direct", Message);
			setData(prev => setMessageData(prev, ""))
			if (Reference.current)
				Reference.current.focus();
			data.socket?.emit(
				"addnotification",
				{reciever: Message.recver, type: "chat"}
			);
		}
	}
	function change(event: ChangeEvent<HTMLInputElement>)
	{
		setData(prev => setMessageData(prev, event.target.value))
	}
	return data.talkingTo ? (
		<form
			onSubmit={submit}
			className="w-[57%] bg-discord4 flex flex-col
				justify-end text-discord6 p-0 rounded-r-3xl"
		>
			<ul className="max-h-90 overflow-auto flex flex-col-reverse">
				{conversation.map(x => {
					const	avatar = avatars.find(y => y.userName == x.sender);
					if (avatar) {
						return (
							<li
								key={x.id}
								className="flex hover:bg-discord3
									rounded-md m-2 p-3"
							>
								<a
									href={`http://localhost:3000/UserProfile?name=${x.sender}`}
								>
									{
										avatar.avatar ?
											<img
												src={avatar.avatar}
												className="h-12 w-12 rounded-full mr-3"
											/> :
											<IconUser
												className="h-12 w-12 rounded-full mr-3
													bg-discord1"
											/>
									}
								</a>
								<div className="w-[80%]">
									<div className="font-extrabold">{x.sender}</div>
									<div className="break-words">{x.message}</div>
								</div>
							</li>
						)
					}
				})}
			</ul>
			<div className="flex m-2">
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
	) : <div></div>;
}
export default ChatPrivate;
