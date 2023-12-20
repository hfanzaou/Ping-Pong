export interface User {
	id:		number,
	login: string
}

interface Users {
	users:		User[],
	user:		string,
	setUser:	React.Dispatch<React.SetStateAction<string>>
}

const Private: React.FC<Users> = ({users, user, setUser}) => {
	function click(event: React.MouseEvent<HTMLButtonElement>)
	{
		setUser(event.currentTarget.name)
	}
	return (
		<ul className="bg-discord3 w-1/6 text-center p-2 text-white font-Inconsolata font-bold min-h-screen overflow-auto">
			{
				users.map(x => {
					return (
						<li key={x.id}>
							<button
								onClick={click}
								name={x.login}
								className={`w-full px-7 py-3 rounded-md select-none ${user == x.login ? "bg-discord5" : "hover:bg-discord4"}`}
							>
								{x.login}
							</button>
						</li>);
				})
			}
		</ul>
	)
}

export default Private;
