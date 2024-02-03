import { IconMessages, IconUsersGroup } from "@tabler/icons-react";
import React from "react";
import { DATA } from "../myTypes";
import { setUserData } from "../utils";

interface Props {
	option: string,
	setOption: React.Dispatch<React.SetStateAction<string>>
	setData: React.Dispatch<React.SetStateAction<DATA>>
	data: DATA
}

const	Nav: React.FC<Props> = ({ option, setOption, setData, data }) => {
	async function clickPrivate()
	{
		setOption("Private");
		const res0 = await fetch("http://localhost:3001/chatUser", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userName: data.userData?.userName
			}),
			credentials: "include"
		});
		const Data = await res0.json();
		if (Data)
			setData(prev => {
				return {
					...setUserData(prev, Data),
					groupTo: undefined,
					talkingTo: undefined
				}
			});
	}
	async function clickRooms()
	{
		setOption("Rooms");
		const res0 = await fetch("http://localhost:3001/chatUser", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userName: data.userData?.userName
			}),
			credentials: "include"
		});
		const Data = await res0.json();
		if (Data)
			setData(prev => {
				return {
					...setUserData(prev, Data),
					groupTo: undefined,
					talkingTo: undefined
				}
			});
	}
	return (
		<nav className="ml-2 mr-2">
			<ul
				className="bg-discord1 h-full flex flex-col
					justify-center rounded-full"
			>
				<li
					onClick={clickPrivate}
					className={`${
							option == "Private"
							? "animate-in bg-discord5"
							: "bg-discord3 animate-out hover:animate-in hover:bg-discord5"
						}
						w-14 h-14 m-2 flex justify-center items-center
						text-white`
					}
				>
					<IconMessages />
				</li>
				<li
					onClick={clickRooms}
					className={`${
							option == "Rooms"
							? "animate-in bg-discord5"
							: "bg-discord3 animate-out hover:animate-in hover:bg-discord5"
						}
						w-14 h-14 m-2 flex justify-center items-center
						text-white`
					}
				>
					<IconUsersGroup />
				</li>
			</ul>
    	</nav>
	)
}

export default Nav;
