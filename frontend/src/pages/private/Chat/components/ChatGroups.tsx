import {
	IconEye,
	IconEyeOff,
	IconSend2,
	IconSettings2,
	IconUser,
	IconX
} from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import { DATA, Group, MESSAGE, NEWCHAT } from "../myTypes";
import { setMessageData } from "../utils";

interface Props {
	data: DATA,
	setData: React.Dispatch<React.SetStateAction<DATA>>
}

const ChatGroups: React.FC<Props> = ({ data, setData }) => {
	const	[inputType, setInputType] = useState("password");
	const	[passwordText, setPasswordText] = useState("");
	const	[passwordError, setPasswordError] = useState(false);
	const	Reference = useRef<HTMLInputElement | null>(null);
	const	dataRef = useRef(data);
	const	[conversation, setConversation] = useState<Array<{
		id: number,
		message: string,
		sender: string,
		avatar: string
	}>>([]);
	const	[settings, setSettings] = useState(false);
	const	[users, setUsers] = useState<Array<{
		id: number,
		avatar: string,
		userName: string,
		role: string
	}>>([])
	
	dataRef.current = data;
	useEffect(() => {
		if (Reference.current)
			Reference.current.focus();
	}, [data.groupTo]);
	useEffect(() => {
		data.socket?.on("clientRoom", callBack);
		return (() => {
			data.socket?.off("clientRoom", callBack);
		})
	}, [data.socket]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch("http://localhost:3001/chathistoryRoom", {
					method: "POST",
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						sender: data.userData?.userName,
						recver: data.groupTo
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
		async function fetchData() {
			const	res = await fetch("http://localhost:3001/groupUsers", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					name: data.groupTo
				})
			});
			const	Data = await res.json();
			if (Data.length)
				setUsers(Data);
		}
		fetchData();
	}, [data])
	async function clickJoinCallBack(state: boolean) {
		if (!state) {
			const	res = await fetch("http://localhost:3001/leaveJoin", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					userName: data.userData?.userName,
					name: data.groupTo
				})
			});
			const	Data: Group[] = await res.json();
			setData(x => {
				if (x.userData)
					return {
						...x,
						userData: {
							...x.userData,
							groups: Data
						}
					}
				return x;
			});
			if (Data.find(x => x.name == data.groupTo)) {
				if (data.groupTo) {
					const	newChat: NEWCHAT = {
						sender: data.userData ? data.userData.userName : "",
						recver: data.groupTo
					}
					data.socket?.emit("newChatRoom", newChat);
				}
			}
			setData(x => ({
				...x,
				send: !x.send
			}))
			setPasswordText("");
			setInputType("password");
		}
	}
	async function clickJoin() {
		if (data.password != undefined)
			await clickJoinCallBack(data.password)
		if (data.password) {
			if (passwordText == "")
				setPasswordError(true);
			else {
				const	res = await fetch("http://localhost:3001/checkPassword", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						name: data.groupTo,
						password: passwordText
					})
				});
				const	Data = await res.json();
				if (Data) {
					setData(x => ({
						...x,
						password: false
					}));
					await clickJoinCallBack(false);
				}
				else {
					setPasswordError(true);
				}
			}
		}
	}
	function clickInputType() {
		setInputType(x => x == "password" ? "text" : "password");
	}
	function changePassword(event: React.ChangeEvent<HTMLInputElement>) {
		setPasswordText(event.target.value);
		setPasswordError(false);
	}
	function changeMessage(event: React.ChangeEvent<HTMLInputElement>) {
		setData(x => ({
			...x,
			message: event.target.value
		}));
	}
	function submitMessage(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (data.message.length) {
			const	Message: MESSAGE = {
				sender: data.userData ? data.userData.userName : "",
				recver: data.groupTo ? data.groupTo : "",
				message: data.message
			}
			data.socket?.emit("room", Message);
			setData(prev => setMessageData(prev, ""))
			if (Reference.current)
				Reference.current.focus();
		}
	}
	function callBack(m: {
		id: number,
		message: string,
		sender: string,
		avatar: string,
	})
	{
		setData(x => ({
			...x,
			send: !x.send
		}))
		setConversation(prev => [m, ...prev]);
	}
	function clickSettings() {
		setSettings(x => !x);
		if (Reference.current)
			Reference.current.focus();
	}
	if (data.groupTo) {
		if (data.userData?.groups.find(x => x.name == data.groupTo))
			return (
				<form
					onSubmit={submitMessage}
					className="w-[57%] bg-discord4 flex flex-col
						justify-end text-discord6 p-0"
				>
					<ul className="max-h-90 overflow-auto flex flex-col-reverse">
						{settings ?
						users.map(x => {
							return (
								<li>{x.userName}</li>
							)
						}) :
						conversation.map(x => {
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
											x.avatar ?
												<img
													src={x.avatar}
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
								</li>)
						})}
					</ul>
					<div className="flex m-2">
						<input
							type="text"
							placeholder="Message..."
							className={
								`bg-discord1 border-none outline-none w-full h-10
									rounded-md mr-2 p-5
									${settings && "cursor-not-allowed"}`
							}
							onChange={changeMessage}
							value={data.message}
							autoFocus
							ref={Reference}
							readOnly={settings}
						/>
						{
							data.message.length ?
								<button
									className="bg-discord1 w-10 h-10 rounded-md
										flex justify-center items-center"
									type="submit"
								>
									<IconSend2 />
								</button> :
								(
									<button
										className="bg-discord1 w-10 h-10 rounded-md
											flex justify-center items-center"
										type="button"
										onClick={clickSettings}
									>
										{!settings ? <IconSettings2 /> : <IconX />}
									</button>
								)
						}
					</div>
				</form>
			);
		else
			return (
				<div className="w-[57%] bg-discord4 flex flex-col justify-center
					items-center text-discord6 p-0 brightness-50">
					join to the group to access the chat room
					{
						data.password &&
							<div>
								{
									passwordError && (
										passwordText == "" ?
										<h6 className="text-red-500">
											you need to enter the password to get
												access to this group
										</h6> :
										<h6 className="text-red-500">
											password wrong! try again
										</h6>)
								}
								<div className="flex justify-center items-center">
									<input
										type={inputType}
										className={`bg-discord1 h-10 rounded-full
											p-5 m-5 outline-none ${passwordError && "outline-red-500"}`}
										placeholder="enter password..."
										value={passwordText}
										onChange={changePassword}
										onKeyDown={x => {
											if (x.key == "Enter")
												clickJoin();
										}}
									/>
									<button onClick={clickInputType}>
										{
											inputType == "password" ?
												<IconEye /> :
												<IconEyeOff />
										}
									</button>
								</div>
							</div>
					}
					<button
						className="bg-discord1 h-10 w-10 rounded-md
							hover:bg-discord5 m-5"
						onClick={clickJoin}
					>
						join
					</button>
				</div>
			)
	}
	return ;
}
export default ChatGroups;

