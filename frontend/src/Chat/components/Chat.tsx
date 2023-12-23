import { ActionIcon } from "@mantine/core";
import { IconPingPong, IconSend2 } from "@tabler/icons-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { DATA } from "../myTypes";

const Chat: React.FC<DATA> = ({ socket }) => {
	const	[message, setMessage] = useState("");
	const	[conversation, setConversation] = useState<string[]>([]);
	const	Reference = useRef<HTMLInputElement | null>(null);

	function callBack(m: string)
	{
			setConversation(prev => [m, ...prev]);
		}
		useEffect(() => {
		socket?.on("client", callBack);
		return (() => {
			socket?.off("client", callBack);
		})
	}, [socket])
	function submit(event: FormEvent<HTMLFormElement>)
	{
		event.preventDefault();
		socket?.emit("server", message);
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
						<li key={x} className="flex hover:bg-discord3 rounded-md m-2 p-3">{x}</li>)
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
export default Chat;
