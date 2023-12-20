import { ActionIcon } from "@mantine/core";
import { IconMessages, IconUsersGroup } from "@tabler/icons-react";

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
			<ul className="bg-discord1 min-h-screen flex flex-col justify-center">
				<li>
					<ActionIcon onClick={clickPrivate} className={`${props.option == "Private" ? "animate-in bg-discord5" : "bg-discord3 animate-out hover:animate-in hover:bg-discord5"} w-14 h-14 m-2`} >
						<IconMessages />
					</ActionIcon>
				</li>
				<li>
					<ActionIcon onClick={clickRooms} className={`${props.option == "Rooms" ? "animate-in bg-discord5" : "bg-discord3 animate-out hover:animate-in hover:bg-discord5"} w-14 h-14 m-2`} >
						<IconUsersGroup />
					</ActionIcon>
				</li>
			</ul>
    	</nav>
	)
}
