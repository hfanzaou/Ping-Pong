import { ActionIcon } from "@mantine/core";
import { IconEye, IconEyeOff, IconPingPong, IconSend2, IconSettings2, IconUser } from "@tabler/icons-react";
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { DATA, MESSAGE } from "../myTypes";
import { setMessageData, setUserData } from "../utils";

interface Props {
	data: DATA,
	setData: React.Dispatch<React.SetStateAction<DATA>>
}

const ChatGroups: React.FC<Props> = ({ data, setData }) => {
	const	[inputType, setInputType] = useState("password");
	const	[passwordText, setPasswordText] = useState("");
	const	[passwordError, setPasswordError] = useState(false);

	async function clickJoin() {
		if (!data.password) {
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
			const	Data = await res.json();
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
			setData(x => ({
				...x,
				send: !x.send
			}))
		}
		else {
			if (passwordText == "")
				setPasswordError(true);
		}
	}
	function clickInputType() {
		setInputType(x => x == "password" ? "text" : "password");
	}
	function changePassword(event: React.ChangeEvent<HTMLInputElement>) {
		setPasswordText(event.target.value);
		setPasswordError(false);
	}
	if (data.groupTo) {
		if (data.userData?.groups.find(x => x.name == data.groupTo))
			return (
				<form
					// onSubmit={submit}
					className="w-[57%] bg-discord4 flex flex-col
						justify-end text-discord6 p-0"
				>
					<ul className="max-h-90 overflow-auto flex flex-col-reverse">
						{/* {conversation.map(x => {
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
						})} */}
					</ul>
					<div className="flex m-2">
						<input
							type="text"
							placeholder="Message..."
							className="bg-discord1 border-none outline-none w-full h-10 rounded-md mr-2 p-5"
							// onChange={change}
							value={data.message}
							autoFocus
							// ref={Reference}
						/>
						<button
							className="bg-discord1 w-10 h-10 rounded-md flex
								justify-center items-center"
							type="submit"
						>
							{ data.message.length ? <IconSend2 /> : <IconSettings2 />}
						</button>
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

