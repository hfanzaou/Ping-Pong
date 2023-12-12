import { ActionIcon } from "@mantine/core";
import { IconMessages, IconUsersGroup } from "@tabler/icons-react";

export default function Nav()
{
	return (
		<nav>
			<ul className="bg-discord1 min-h-screen flex flex-col justify-center">
				<li><ActionIcon className="bg-discord3 animate-out hover:animate-in hover:bg-discord5 w-14 h-14 m-2" ><IconMessages /></ActionIcon></li>
				<li><ActionIcon className="bg-discord3 animate-out hover:animate-in hover:bg-discord5 w-14 h-14 m-2" ><IconUsersGroup /></ActionIcon></li>
			</ul>
    	</nav>
	)
}
