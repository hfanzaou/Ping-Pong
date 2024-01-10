import { IconCirclePlus, IconDotsVertical, IconTrash, IconVolume3 } from "@tabler/icons-react";
import React, { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";

function Groups() {
	const	[settings, setSettings] = useState(false);
	const	[settingsXy, setSettingsXy] = useState({
		x: 0,
		y: 0,
	})
	const	settingsXyRef = useRef(settingsXy);
	const	[create, setCreate] = useState(false);
	
	settingsXyRef.current = settingsXy;
	useEffect(() => {
		function callBackMouse(event: MouseEvent) {
			if (event.clientX < settingsXyRef.current.x ||
				event.clientX > settingsXyRef.current.x + 100 ||
				event.clientY < settingsXyRef.current.y ||
				event.clientY > settingsXyRef.current.y + 50)
				setSettings(false);
		}
		document.addEventListener("mousedown", callBackMouse);
		return () => {
			document.removeEventListener("mousedown", callBackMouse);
		}
	}, [])
	// useEffect(() => {
	// 	if (createTrigger) {
			
	// 	}
	// }, [createTrigger])
	function clickSettings(event: React.MouseEvent<HTMLButtonElement>) {
		setSettings(true);
		setSettingsXy({
			x: event.clientX,
			y: event.clientY,
		})
	}
	function clickCreate(event: React.MouseEvent<HTMLButtonElement>) {
		setSettings(false);
		setCreate(true);
		setSettingsXy({ x: event.clientX, y: event.clientY})
	}
	return (
		<div className="bg-discord3 w-2/6 text-center p-2 text-white
			font-Inconsolata font-bold h-full overflow-auto
			min-w-[100px] rounded-s-3xl"
		>
			<div className="w-full flex">
				<input
					type="text"
					placeholder="search..."
					className="w-full font-thin bg-discord1
						h-10 p-5 outline-none rounded-l-full mb-3"
					// onChange={change}
					// value={text}
				/>
				<button 
					className="bg-discord1 rounded-r-full h-10 w-10 flex
						justify-center items-center hover:bg-discord2"
					onClick={clickSettings}
				>
					<IconDotsVertical />
				</button>
				{
					settings && <ul
						className={`fixed border-none
							bg-discord1 rounded-md`}
						style={{
							top: settingsXy.y,
							left: settingsXy.x
						}}
					>
						<li>
							<button
								className="flex justify-center items-center w-[100px]
									h-[50px] rounded-t-md hover:bg-discord3"
								onClick={clickCreate}
							>
								<IconCirclePlus />
								<h2 className="mt-1">Create</h2>
							</button>
						</li>
					</ul>
				}
				{
					create &&
						<form
							className="fixed font-thin w-[400px]"
							style={{ top: settingsXy.y, left: settingsXy.x}}
						>
							<input
								type="text"
								placeholder="group name..."
								className="outline-none border-none bg-discord1
									h-10 p-5 rounded-full w-full"
							/>
							<div>
								<label>
									<input
										type="radio"
										value="Private"
										name="PrivatePublic"
									/>
									Private
								</label>
								<label>
									<input
										type="radio"
										value="Public"
										name="PrivatePublic"
									/>
									Public
								</label>
							</div>
							<input
								type="text"
								placeholder="set a password...or leave it empty for no password"
								className="outline-none border-none bg-discord1
									h-10 p-5 rounded-full w-full"
							/>
						</form>
				}
			</div>
			<ul>
				{
					// List?.map(x => {
					// 	return (
					// 		<li key={x.id} className="flex relative">
					// 			<button
					// 				onClick={click}
					// 				name={x.login}
					// 				className={`w-full px-7 py-3 rounded-md
					// 				select-none ${data.talkingTo == x.login
					// 					? "bg-discord5"
					// 					: "hover:bg-discord4"}
					// 					flex justify-center items-center`}
					// 			>
					// 				<img
					// 					src={x.avatar}
					// 					className={`w-10 h-10 mr-3
					// 						rounded-full
					// 						${
					// 							data.talkingTo == x.login &&
					// 								"shadow-black shadow-lg"
					// 						}`}
					// 				/>
					// 				{size && x.login}
					// 			</button>
					// 			<button
					// 				className="absolute top-5 right-0 w-10 flex justify-center"
					// 				onClick={clickSettings}
					// 				name={x.login}
					// 			>
					// 				<IconDotsVertical/ >
					// 			</button>
					// 		</li>);
					// })
				}
			</ul>
			{
				// settings && <ul
				// 	className={`fixed border-none
				// 		bg-discord1 rounded-md`}
				// 	style={{
				// 		top: settingsXy.y,
				// 		left: settingsXy.x
				// 	}}
				// >
				// 	<li>
				// 		<button
				// 			className="flex justify-center items-center w-[100px]
				// 				h-[50px] rounded-t-md hover:bg-discord3"
				// 			onClick={block}
				// 		>
				// 			<IconTrash />
				// 			<h2 className="mt-1">Block</h2>
				// 		</button>
				// 	</li>
				// 	<li>
				// 		<button
				// 			className="flex justify-center items-center w-[100px]
				// 				h-[50px] rounded-b-md hover:bg-discord3"
				// 			onClick={mute}
				// 		>
				// 			<IconVolume3 />
				// 			<h2 className="">Mute</h2>
				// 		</button>
				// 	</li>
				// </ul>
			}
		</div>
	)
}

export default Groups;
