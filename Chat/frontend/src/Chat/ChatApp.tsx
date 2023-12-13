import { useState } from "react";
import Nav from "./components/Nav";
import Private, { User } from "./components/Private";
import Chat from "./components/Chat";

export default function ChatApp()
{
	const	[option, setOption] = useState("Private");
	const	users: User[] = [{name: "user1"}, {name: "user2"}, {name: "user3"}]
	const	group: User[] = [{name: "group1"}, {name: "group2"}, {name: "group3"}]

	return (
		<div className="flex">
			<Nav option={option} setOption={setOption}/>
			<Private users={(option == "Private") ? users : group}/>
			<Chat />
		</div>
	)
}
