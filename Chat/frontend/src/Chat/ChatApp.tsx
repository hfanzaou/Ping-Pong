import Nav from "./components/Nav";
import Private from "./components/Private";
import Rooms from "./components/Rooms";

export default function ChatApp()
{
	return (
		<div className="flex">
			<Nav />
			<Private />
			<Rooms />
		</div>
	)
}
