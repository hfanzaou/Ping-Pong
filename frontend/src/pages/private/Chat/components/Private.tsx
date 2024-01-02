import { DATA, NEWCHAT } from "../myTypes";
import React from "react";

interface Props {
	data:		DATA,
	setData:	React.Dispatch<React.SetStateAction<DATA>>
}

const Private: React.FC<Props> = ({ data, setData }) => {
	function click(event: React.MouseEvent<HTMLButtonElement>)
	{
		const tmp = event.currentTarget.name;

		setData(prev => ({
			...prev,
			talkingTo: tmp
		}))
		const	newChat: NEWCHAT = {
			sender: data.userData ? data.userData.userName : "",
			recver: tmp
		}
		data.socket?.emit("newChat", newChat);
	}
	return (
		<ul
			className="bg-discord3 w-1/6 text-center p-2 text-white
				font-Inconsolata font-bold h-full overflow-auto"
		>
			{
				data.userData?.chatUsers.map(x => {
					return (
						<li key={x.id}>
							<button
								onClick={click}
								name={x.login}
								className={`w-full px-7 py-3 rounded-md
									select-none ${data.talkingTo == x.login
									? "bg-discord5"
									: "hover:bg-discord4"}`}
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
