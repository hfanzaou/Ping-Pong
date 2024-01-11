import { IconMessages, IconUsersGroup } from "@tabler/icons-react";
import React from "react";
import { DATA } from "../myTypes";

interface Props {
	option: string,
	setOption: React.Dispatch<React.SetStateAction<string>>
	setData: React.Dispatch<React.SetStateAction<DATA>>
}

const	Nav: React.FC<Props> = ({ option, setOption, setData}) => {
	function clickPrivate()
	{
		setOption("Private");
	}
	function clickRooms()
	{
		setOption("Rooms");
		setData(x => ({
			...x,
			talkingTo: undefined
		}));

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
