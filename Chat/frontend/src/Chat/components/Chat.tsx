import { ActionIcon } from "@mantine/core";
import { IconPingPong, IconSend2 } from "@tabler/icons-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const	socket = io("http://localhost:3000");

export default function Chat()
{
	const	[message, setMessage] = useState("");
	const	[conversation, setConversation] = useState<string[]>([]);
	const	Reference = useRef<HTMLInputElement | null>(null);

	function submit(event: FormEvent<HTMLFormElement>)
	{
		event.preventDefault();
		setConversation(prev => [message, ...prev]);
		setMessage("");
		if (Reference.current)
			Reference.current.focus();
	}
	function change(event: ChangeEvent<HTMLInputElement>)
	{
		setMessage(event.target.value);
	}
	return (
		<form onSubmit={submit} className="w-screen bg-discord4 p-2 flex flex-col justify-end text-discord6">
			<ul className="max-h-90 overflow-auto flex flex-col-reverse">
				{conversation.map(x => {
					return (
						<li className="flex hover:bg-discord3 rounded-md m-2 p-3">{x}</li>)
				})}
			</ul>
			<div className="flex">
				<input
					type="text"
					placeholder="Message..."
					className="bg-discord1 border-none outline-none w-full h-10 rounded-md mr-2 p-5"
					onChange={change}
					value={message}
					autoFocus
					ref={Reference}
				/>
				<ActionIcon className="bg-discord1 w-10 h-10 rounded-md" type="submit">
					{ message.length ? <IconSend2 /> : <IconPingPong/>}
				</ActionIcon>
			</div>
		</form>
	);
}
