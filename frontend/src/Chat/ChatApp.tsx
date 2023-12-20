import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Private, { User } from "./components/Private";
import Chat from "./components/Chat";

export default function ChatApp()
{
	const	[option, setOption] = useState("Private");
	const	[users, setUsers] = useState<User[]>([]);
	const	[user, setUser] = useState("");

	useEffect(() => {
		async function fetchData() {
			console.log(user);
			const	res = await fetch("http://localhost:3001/chat", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ user: user })
			});
			const	data = await res.json();
			setUsers(data);
		}
		fetchData();
	}, [user]);
	return (
		<div className="flex">
			<Nav option={option} setOption={setOption}/>
			<Private users={(option == "Private") ? users : []} user={user} setUser={setUser}/>
			<Chat />
		</div>
	)
}
