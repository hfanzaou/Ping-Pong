import { ActionIcon } from "@mantine/core";
import { IconPingPong, IconSend2 } from "@tabler/icons-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { DATA, MESSAGE } from "../myTypes";
import { setMessageData } from "../utils";

interface Props {
	data: DATA,
	setData: React.Dispatch<React.SetStateAction<DATA>>
}

const Chat: React.FC<Props> = ({ data, setData }) => {
	const	[conversation, setConversation] = useState<string[]>([]);
	const	Reference = useRef<HTMLInputElement | null>(null);

	function callBack(m: string)
	{
		setConversation(prev => [m, ...prev]);
	}
	useEffect(() => {
		data.socket?.on("client", callBack);
		return (() => {
			data.socket?.off("client", callBack);
		})
	}, [data.socket])
	function submit(event: FormEvent<HTMLFormElement>)
	{
		event.preventDefault();
		console.log(data);
		const	Message: MESSAGE = {
			sender: data.userData ? data.userData.userName : "",
			recver: data.talkingTo ? data.talkingTo: "",
			message: data.message
		}
		data.socket?.emit("server", Message);
		setData(prev => setMessageData(prev, ""))
		if (Reference.current)
			Reference.current.focus();
	}
	function change(event: ChangeEvent<HTMLInputElement>)
	{
		setData(prev => setMessageData(prev, event.target.value))
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
					value={data.message}
					autoFocus
					ref={Reference}
				/>
				<ActionIcon className="bg-discord1 w-10 h-10 rounded-md" type="submit">
					{ data.message.length ? <IconSend2 /> : <IconPingPong/>}
				</ActionIcon>
			</div>
		</form>
	);
}
export default Chat;
