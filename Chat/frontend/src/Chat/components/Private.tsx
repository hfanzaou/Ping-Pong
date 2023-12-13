import { useState } from "react"

export interface User {
	name: string
}

interface Users {
	users: User[]
}

const Private: React.FC<Users> = ({users}) => {
	const	[user, setUser] = useState("");

	function click(event: React.MouseEvent<HTMLButtonElement>)
	{
		setUser(event.currentTarget.name)
		console.log(event.currentTarget.name)
	}
	return (
		<ul className="bg-discord3 w-1/6 text-center p-2 text-white font-Inconsolata font-bold min-h-screen overflow-auto">
			{
				users.map(x => {
					return (
						<li key={x.name}>
							<button
								onClick={click}
								name={x.name}
								className={`w-full px-7 py-3 rounded-md select-none ${user == x.name ? "bg-discord5" : "hover:bg-discord4"}`}
							>
								{x.name}
							</button>
						</li>);
				})
			}
		</ul>
	)
}

export default Private;
