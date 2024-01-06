import { IconMessages, IconUsersGroup } from "@tabler/icons-react";
import React from "react";

export default function Nav(props: {option: string, setOption: React.Dispatch<React.SetStateAction<string>>})
{
	function clickPrivate()
	{
		props.setOption("Private");
	}
	function clickRooms()
	{
		props.setOption("Rooms");
	}
	return (
		<nav>
			<ul className="bg-discord1 h-full flex flex-col justify-center">
				<li
					onClick={clickPrivate}
					className={`${
							props.option == "Private"
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
							props.option == "Rooms"
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
