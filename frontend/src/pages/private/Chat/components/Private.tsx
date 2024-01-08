import { light } from "@mui/material/styles/createPalette";
import { DATA, NEWCHAT, USERDATA, User } from "../myTypes";
import React, { useEffect, useState } from "react";
import { setUserData } from "../utils";

interface Props {
	data:		DATA,
	setData:	React.Dispatch<React.SetStateAction<DATA>>
}

const Private: React.FC<Props> = ({ data, setData }) => {
	const	[List, setList] = useState(data.userData?.chatUsers);
	const	[text, setText] = useState("");

	async function callBack() {
		const res0 = await fetch("http://localhost:3001/chatUser", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				socket: data.socket?.id,
				username: data.userData?.userName
			})
		});
		const Data = await res0.json();
		// console.log(Data);
		setData(prev => setUserData(prev, Data));
	}
	useEffect(() => {
		setList(data.userData?.chatUsers)
		// data.socket?.on("newMessage", () =>{});
		data.socket?.on("newuser", callBack);
		return () => {
			data.socket?.off("newuser", callBack);
		}
	}, [data.userData?.chatUsers])
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
		data.socket?.emit("newChat", newChat);
	}
	function change(event: React.ChangeEvent<HTMLInputElement>) {
		setText(event.target.value);
		if (event.target.value == "" && data.userData)
			setList(data.userData.chatUsers);
		else if (data.userData){
			const list	= [...data.userData?.chatUsers,
				...data.userData?.friends]
				.filter((value, index, self) => {
					for (let i = index + 1; i < self.length; i++) {
						if (value.id == self[i].id)
							return false;
					}
					return true;
				})
				.filter((value => value.login
					.includes(event.target.value)));
			setList(list);
		}
	}
	return (
		<div className="bg-discord3 w-2/6 text-center p-2 text-white
				font-Inconsolata font-bold h-full overflow-auto"
		>
			<input
				type="text"
				placeholder="search..."
				className="w-full font-thin bg-discord1
					h-10 p-5 outline-none rounded-full mb-3"
				onChange={change}
				onKeyDown={x => {
					if (x.key == "Enter")
						setText("");
				}}
				value={text}
			/>
			<ul>
				{
					List?.map(x => {
						return (
							<li key={x.id}>
								<button
									onClick={click}
									name={x.login}
									className={`w-full px-7 py-3 rounded-md
										select-none ${data.talkingTo == x.login
										? "bg-discord5"
										: "hover:bg-discord4"}
										flex justify-center items-center`}
								>
									<img
										src={x.avatar}
										className="w-10 h-10 mr-3 rounded-full"
									/>
									{x.login}
								</button>
							</li>);
					})
				}
			</ul>
		</div>
	)
}

export default Private;
