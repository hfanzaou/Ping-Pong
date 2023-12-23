import { DATA } from "../myTypes";

interface Users {
	data:		DATA,
	setData:	React.Dispatch<React.SetStateAction<DATA>>
}

const Private: React.FC<Users> = ({ data, setData }) => {
	function click(event: React.MouseEvent<HTMLButtonElement>)
	{
		const tmp = event.currentTarget.name;

		setData(prev => ({
			...prev,
			talkingTo: tmp
		}))
	}
	return (
		<ul
			className="bg-discord3 w-1/6 text-center p-2 text-white
				font-Inconsolata font-bold min-h-screen overflow-auto"
		>
			{
				data.userData?.chatUsers.map(x => {
					return (
						<li key={x.id}>
							<button
								onClick={click}
								name={x.login}
								className={`w-full px-7 py-3 rounded-md
									select-none ${data.talkingTo == x.login ?
									"bg-discord5" :
									"hover:bg-discord4"}`}
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
