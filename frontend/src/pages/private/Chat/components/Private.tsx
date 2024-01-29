import { DATA, NEWCHAT } from "../myTypes";
import React, { useEffect, useRef, useState } from "react";
import { setUserData } from "../utils";
import {
	IconCircleFilled,
	IconDotsVertical,
	IconTrash,
	IconUser,
	IconUserCircle,
	IconVolume3
} from "@tabler/icons-react";

interface Props {
	data:		DATA,
	setData:	React.Dispatch<React.SetStateAction<DATA>>
}

const Private: React.FC<Props> = ({ data, setData }) => {
	const	[List, setList] = useState(data.userData?.chatUsers);
	const	[text, setText] = useState("");
	const	[settings, setSettings] = useState(false);
	const	[settingsXy, setSettingsXy] = useState({
		x: 0,
		y: 0,
		login: ""
	})
	const	settingsXyRef = useRef(settingsXy);
	const	[blockTrigger, setBlockTrigger] = useState(false)
	const	[size, setSize] = useState(window.innerWidth < 600 ? false : true);
	const	userNameRef = useRef(data.userData?.userName);

	settingsXyRef.current = settingsXy;
	userNameRef.current = data.userData?.userName;
	async function onlineCallback(message: {username: string, state: string}) {
		const res0 = await fetch("http://localhost:3001/chatUser", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userName: userNameRef.current
			})
		});
		const Data = await res0.json();
		setData(prev => setUserData(prev, Data));
	}
	useEffect(() => {
		data.socket?.on("online", onlineCallback);
		return () => {
			data.socket?.off("online", onlineCallback)
		}
	}, [data.socket]);
	useEffect(() => {
		setText("");
	}, [data.send])
	useEffect(() => {
		function callBackMouse(event: MouseEvent) {
			if (event.clientX < settingsXyRef.current.x ||
				event.clientX > settingsXyRef.current.x + 100 ||
				event.clientY < settingsXyRef.current.y ||
				event.clientY > settingsXyRef.current.y + 150)
				setSettings(false);
		}
		function callBackResize() {
			if (window.innerWidth < 600)
				setSize(false);
			else
				setSize(true);
		}
		document.addEventListener("mousedown", callBackMouse);
		window.addEventListener("resize", callBackResize);
		return () => {
			document.removeEventListener("mousedown", callBackMouse);
			window.removeEventListener("resize", callBackResize);
		}
	}, [])
	async function callBack() {
		const res0 = await fetch("http://localhost:3001/chatUser", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userName: userNameRef.current
			})
		});
		const Data = await res0.json();
		// console.log(Data);
		setData(prev => setUserData(prev, Data));
	}
	useEffect(() => {
		setList(data.userData?.chatUsers.sort((x, y) => {
			// console.log("here");
			if (x.time && y.time) {
				const	timeX = new Date(x.time);
    			const	timeY = new Date(y.time);
    			return timeY.getTime() - timeX.getTime();
			}
			return 0;
		}))
		data.socket?.on("newuser", callBack);
		return () => {
			data.socket?.off("newuser", callBack);
		}
	}, [data.userData?.chatUsers])
	useEffect(() => {
		if (blockTrigger) {
			async function fetchData() {
				await fetch("http://localhost:3001/user/block", {
					method: "POST",
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						name: settingsXy.login
					}),
					credentials: "include"
				})
				await callBack();
				setData(x => ({ ...x, talkingTo: undefined }));
			}
			fetchData();
			setBlockTrigger(false);
			setSettings(false);
		}
	}, [blockTrigger])
	function click(event: React.MouseEvent<HTMLButtonElement>)
	{
		const tmp = event.currentTarget.name;

		setData(prev => ({
			...prev,
			talkingTo: tmp
		}))
		const	newChat: NEWCHAT = {
			sender: data.userData ? data.userData.userName : "",
			recver: tmp
		}
		data.socket?.emit("newChatPrivate", newChat);
	}
	function change(event: React.ChangeEvent<HTMLInputElement>) {
		setText(event.target.value);
		if (event.target.value == "" && data.userData)
			setList(data.userData.chatUsers.sort((x, y) => {
				if (x.time && y.time) {
					const	timeX = new Date(x.time);
    				const	timeY = new Date(y.time);
    				return timeY.getTime() - timeX.getTime();
				}
				return 0;
			}));
		else if (data.userData){
			const list	= [...data.userData?.chatUsers,
				...data.userData?.friends]
				.filter((value, index, self) => {
					for (let i = index + 1; i < self.length; i++) {
						if (value && self[i] && value.id == self[i].id)
							return false;
					}
					return true;
				})
				.filter((value => value && value.login
					.includes(event.target.value)));
			setList(list);
			if (!list.find(x => x.login == data.talkingTo))
					setData(x => ({
						...x,
						talkingTo: undefined
					}))
		}
	}
	function clickSettings(event: React.MouseEvent<HTMLButtonElement>) {
		setSettingsXy({
			x: event.clientX,
			y: event.clientY,
			login: event.currentTarget.name
		})
		setSettings(true);
	}
	function block() {
		setBlockTrigger(true);
	}
	function mute() {}
	function clickTest() {
		List && console.log(List[0].unRead)
	}
	return (
		<div className="bg-discord3 w-2/6 text-center p-2 text-white
			font-Inconsolata font-bold h-full overflow-auto
			min-w-[100px] rounded-s-3xl"
		>
			<input
				type="text"
				placeholder="search..."
				className="w-full font-thin bg-discord1
					h-10 p-5 outline-none rounded-full mb-3"
				onChange={change}
				value={text}
			/>
			<ul>
				{
					List?.map(x => {
						if (x) {
							
							return (
								<li key={x.id} className="flex relative">
									<button
										onClick={click}
										name={x.login}
										className={`w-full px-7 py-3 rounded-md
										select-none ${data.talkingTo == x.login
											? "bg-discord5"
											: "hover:bg-discord4"}
											flex justify-center items-center group`}
									>
										{
											x.avatar ?
												<div className="relative">
													<img
														src={x.avatar}
														className={`w-10 h-10 mr-3
															rounded-full
															${
																data.talkingTo == x.login &&
																	"shadow-black shadow-lg"
															}`}
													/>
													<div
														className={
															`w-4 absolute -top-1
															-left-1 h-4 rounded-full
															z-10 border-4 ${
																x.login != data.talkingTo ?
																	`border-discord3
																	group-hover:border-discord4 ${
																		x.state == "Online" ?
																			"bg-green-500" :
																			"bg-gray-500"
																	}` :
																	`border-discord5 ${
																		x.state == "Online" ?
																			"bg-green-300" :
																			"bg-gray-300"
																	}`
															}`
														}
													></div>
													{
														x.unRead != 0 &&
														<div
															className={
																`absolute -bottom-2
																right-1 rounded-full
																z-10 border-4 bg-red-500 text-xs px-1 ${
																	x.login != data.talkingTo ?
																		`border-discord3
																		group-hover:border-discord4` :
																		`border-discord5 shadow-black
																		shadow-lg`
																}`
															}
														>
															{
																x.unRead &&
																	(
																		x.unRead < 100 ? x.unRead : "+99"
																	)
															}
														</div>
													}
												</div> :
												<div className="relative">
													<IconUser
														className={`w-10 h-10 mr-3
															rounded-full bg-discord1
															${
																data.talkingTo == x.login &&
																	"shadow-black shadow-lg"
															}`}
													/>
													<div
														className={
															`w-4 absolute -top-1
															-left-1 h-4 rounded-full
															z-10 border-4 ${
																x.login != data.talkingTo ?
																	`border-discord3
																	group-hover:border-discord4 ${
																		x.state == "Online" ?
																			"bg-green-500" :
																			"bg-red-500"
																	}` :
																	`border-discord5 ${
																		x.state == "Online" ?
																			"bg-green-300" :
																			"bg-red-500"
																	}`
															}`
														}
													></div>
													{
														x.unRead != 0 &&
														<div
															className={
																`absolute -bottom-2
																right-1 rounded-full
																z-10 border-4 bg-red-500 text-xs px-1 ${
																	x.login != data.talkingTo ?
																		`border-discord3
																		group-hover:border-discord4` :
																		`border-discord5 shadow-black
																		shadow-lg`
																}`
															}
														>
															{
																x.unRead &&
																	(
																		x.unRead < 100 ? x.unRead : "+99"
																	)
															}
														</div>
													}
												</div>
										}
										{size && x.login}
									</button>
									<button
										className="absolute top-5 right-0 w-10 flex justify-center"
										onClick={clickSettings}
										name={x.login}
									>
										<IconDotsVertical/ >
									</button>
								</li>
							);
						}
					})
				}
			</ul>
			{
				settings && <ul
					className={`fixed border-none
						bg-discord1 rounded-md`}
					style={{
						top: settingsXy.y,
						left: settingsXy.x
					}}
				>
					<li>
						<button
							className="flex justify-center items-center w-[100px]
								h-[50px] rounded-t-md hover:bg-discord3"
							onClick={block}
						>
							<IconTrash />
							<h2 className="mt-1">Block</h2>
						</button>
					</li>
					<li>
						<button
							className="flex justify-center items-center w-[100px]
								h-[50px] hover:bg-discord3"
							onClick={mute}
						>
							<IconVolume3 />
							<h2 className="">Mute</h2>
						</button>
					</li>
					<li>
						<a
							href={`http://localhost:3000/UserProfile?name=${settingsXy.login}`}
						>
							<button
								className="flex justify-center items-center w-[100px]
									h-[50px] rounded-b-md hover:bg-discord3"
							>
								<IconUserCircle />
								<h2 className="">Profile</h2>
							</button>
						</a>
					</li>
				</ul>
			}
		</div>
	)
}

export default Private;
