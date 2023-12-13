export default function Chat()
{
	return (
		<div className="w-screen relative bg-discord2">
			<input className="absolute bottom-2 right-2 w-99 h-12 bg-discord1 text-white focus:outline-none border-nobe border-discord4 rounded-md p-5"
				placeholder="Message..."
			/>
		</div>
	);
}
