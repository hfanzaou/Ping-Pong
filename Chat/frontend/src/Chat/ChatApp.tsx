import { useState } from "react";
import Nav from "./components/Nav";
import Private from "./components/Private";
import Rooms from "./components/Rooms";

export default function ChatApp()
{
	const [option, setOption] = useState("Private");

	return (
		<div className="flex">
			<Nav option={option} setOption={setOption}/>
			{option == "Private" ? <Private /> : <Rooms />}
		</div>
	)
}
