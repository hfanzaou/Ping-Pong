import { useState } from "react"

interface User {
	name: string
}

export default function Private()
{
	const	[user, setUser] = useState("user1");
	const	[users, setUsers] = useState<User[]>([{name: "user1"}, {name: "user2"}, {name: "user3"}, {name: "user4"},])

	function click(event: React.MouseEvent<HTMLButtonElement>)
	{
		setUser(event.currentTarget.name)
		console.log(event.currentTarget.name)
	}
	return (
		<div className="w-full">
			<ul className="bg-discord3 w-1/6 text-center p-2 text-white font-Inconsolata font-bold min-h-screen overflow-auto">
				{
					users.map(x => {
						return (
							<li key={x.name}>
								<button onClick={click} name={x.name} className="hover:bg-discord4 w-full px-7 py-3 rounded-md focus:bg-discord5 select-none">
									{x.name}
								</button>
							</li>);
					})
				}
			</ul>
		</div>
	)
}
