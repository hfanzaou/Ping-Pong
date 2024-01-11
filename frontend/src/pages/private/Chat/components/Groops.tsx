import { IconCirclePlus, IconDotsVertical } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import { DATA } from "../myTypes";

interface Props {
	data: DATA,
}

const Groups: React.FC<Props> = ({ data }) => {
	const	[settingsXy, setSettingsXy] = useState({
		x: 0,
		y: 0,
	})
	const	settingsXyRef = useRef(settingsXy);
	const	[create, setCreate] = useState(false);
	const	[password, setPassword] = useState(true);
	const	[createData, setCreateData] = useState({
		name: "",
		state: "",
		password: "",
		owner: data.userData?.userName
	});
	const	[passwordText, setPasswordText] = useState("");
	const	[validate, setValidate] = useState(true);
	const	[createTrigger, setCreateTrigger] = useState(false);
	const	[name, setName] = useState(true);
	const	nameRef = useRef(name);
	
	settingsXyRef.current = settingsXy;
	nameRef.current = name;
	useEffect(() => {
		function callBackMouse(event: MouseEvent) {
			if (event.clientX < settingsXyRef.current.x ||
				event.clientX > settingsXyRef.current.x + 400 ||
				event.clientY < settingsXyRef.current.y ||
				event.clientY > settingsXyRef.current.y + 320)
				setCreate(false);
		}
		document.addEventListener("mousedown", callBackMouse);
		return () => {
			document.removeEventListener("mousedown", callBackMouse);
		}
	}, [])
	useEffect(() => {
		setCreateData(x => ({
			...x,
			owner: data.userData?.userName
		}))
	}, [data.userData?.userName])
	useEffect(() => {
		if (createTrigger) {
			async function fetchData() {
				const	res = await fetch("http://localhost:3001/createGroup", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						data: createData
					})
				})
				const	Data = await res.json();
				if (Data) {
					setPasswordText("")
					setCreate(false);
					setCreateData(x => ({
						...x,
						name: "",
						state: "",
						password: ""
					}));
				}
				setName(Data);
			}
			fetchData()
			setCreateTrigger(false);
		}
	}, [createTrigger])
	function clickCreate(event: React.MouseEvent<HTMLButtonElement>) {
		setCreate(true);
		setSettingsXy({ x: event.clientX, y: event.clientY})
	}
	function clickPrivatePublic(event: React.MouseEvent<HTMLButtonElement>) {
		const tmp = event.currentTarget.name;
		setCreateData(x => ({
			...x,
			state: tmp
		}))
	}
	function submitCreate(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (password && validate) {
			setCreateTrigger(true);
		}
	}
	function changeCreate(event: React.ChangeEvent<HTMLInputElement>) {
		setCreateData(x => ({
			...x,
			name: event.target.value,
		}))
	}
	function changePassword(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.value.length == 0)
			setPassword(true);
		else if (event.target.value.length < 6)
			setPassword(false);
		else
			setPassword(true);
		setPasswordText(event.target.value);
	}
	function changeValidate(event: React.ChangeEvent<HTMLInputElement>) {
		if (passwordText == event.target.value) {
			setValidate(true);
			setCreateData(x => ({
				...x,
				password: event.target.value
			}));
		}
		else
			setValidate(false);
	}
	return (
		<div className="bg-discord3 w-2/6 text-center p-2 text-white
			font-Inconsolata font-bold h-full overflow-auto
			min-w-[100px] rounded-s-3xl"
		>
			<div className="w-full flex">
				<button
					className="bg-discord1 rounded-l-full h-10 w-10 flex
						justify-center items-center hover:bg-discord2"
					onClick={clickCreate}
				>
					<IconCirclePlus />
				</button>
				<input
					type="text"
					placeholder="search..."
					className="w-full font-thin bg-discord1
						h-10 p-5 outline-none rounded-r-full mb-3"
					// onChange={change}
					// value={text}
				/>
				{
					create &&
						<form
							className="fixed font-thin w-[400px] bg-discord1 p-5
								rounded-md"
							style={{ top: settingsXy.y, left: settingsXy.x}}
							onSubmit={submitCreate}
						>
							{
								!name &&
									<h6 className="text-red-500">this name is already taken</h6>
							}
							<input
								type="text"
								placeholder="group name..."
								className={`outline-none border-none bg-discord3
									h-10 p-5 rounded-full w-full mb-5
									${!name && "outline-red-500"}`}
								onChange={changeCreate}
								value={createData.name}
							/>
							<div className="flex h-10 mb-5">
								<button
									type="button"
									onClick={clickPrivatePublic}
									name="Private"
									className={`bg-discord3 w-full mr-2
										rounded-md
										${createData.state == "Private" ?
											"bg-discord5" :
											"hover:bg-discord4"}`}
								>
									Private
								</button>
								<button
									type="button"
									onClick={clickPrivatePublic}
									name="Public"
									className={`bg-discord3 w-full ml-2
										rounded-md
										${createData.state == "Public" ?
											"bg-discord5" :
											"hover:bg-discord4"}`}
								>
									Public
								</button>
							</div>
							{
								!password &&
									<h6 className="text-red-400">
										the password should have:
											at least 6 characters
									</h6>
							}
							<input
								type="password"
								placeholder="password...or leave it empty for no password"
								className={`outline-none border-none bg-discord3
									h-10 p-5 rounded-full w-full mb-5
									${!password && "outline-red-500"}`}
								onChange={changePassword}
								value={passwordText}
							/>
							<input
								type="password"
								placeholder="confirm password"
								className={`outline-none border-none bg-discord3
									h-10 p-5 rounded-full w-full mb-5
									${!validate && "outline-red-500"}`}
								onChange={changeValidate}
							/>
							<button className="bg-discord3 w-full rounded-md h-10
								hover:bg-discord4"
							>
								create
							</button>
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
