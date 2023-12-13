export default function Rooms()
{
	return (
		<div className="w-full">
			<ul className="bg-discord3 w-1/6 text-center p-2 text-white font-Inconsolata min-h-screen font-bold overflow-auto">
				<li><button className="hover:bg-discord4 w-full px-7 py-3 rounded-md focus:bg-discord5 select-none">GROUP1</button></li>
				<li><button className="hover:bg-discord4 w-full px-7 py-3 rounded-md focus:bg-discord5 select-none">GROUP2</button></li>
				<li><button className="hover:bg-discord4 w-full px-7 py-3 rounded-md focus:bg-discord5 select-none">GROUP3</button></li>
				<li><button className="hover:bg-discord4 w-full px-7 py-3 rounded-md focus:bg-discord5 select-none">GROUP4</button></li>
			</ul>
		</div>
	)
}

