import React, { useEffect, useRef, useState } from "react";
import Nav from "./components/Nav";
import Private from "./components/Private";
import { DATA } from "./myTypes";
import { Socket } from "socket.io-client";
import { setSocket, setUserData } from "./utils";
import Groups from "./components/Groups";
import ChatPrivate from "./components/ChatPrivate";
import ChatGroups from "./components/ChatGroups";
import { useLocation, useNavigate } from "react-router-dom";
import NotFound from "../../public/NotFound/NotFound";

interface Props {
	socket: Socket
}

const ChatApp: React.FC<Props> = ({ socket }) => {
	const	[data, setData] = useState<DATA>({
		message: "",
		trigger: true,
		send: true
	});
	const	[option, setOption] = useState("Rooms");
	const	[error, setError] = useState(false);
	const	errorRef = useRef(error);
	const	[notFound, setNotFound] = useState(false);
	const	[name, setName] = useState<string>("");
	const	query = useQuery();
	const	[loading, setLoading] = useState(false);
	const	history = useNavigate();

	//
	useEffect(() => {
		console.log("CHAT");
	}, [])
	//
	errorRef.current = error;
	useEffect(() => {
		const	tmp = query.get("name")
		if (tmp) {
			setName(tmp);
			async function fetchData() {
				const res = await fetch("checkUserGroup", {
					method: "POST",
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						userName: data.userData?.userName,
						name: tmp
					}),
					credentials: "include"
				});
				const Data = await res.json()
				if (!Data) {
					setNotFound(true);
					if (!data.userData?.userName)
						setLoading(true);
					else
						setLoading(false);
				}
				else {
					setNotFound(false);
					history("/Chat");
				}
				setOption("Rooms");
			}
			if (data.userData?.userName && tmp)
				fetchData();
		}
		else if (notFound)
			window.location.reload();
	}, [query])
	useEffect(() => {
		async function fetchData() {
			setData(prev => setSocket(prev, socket));
			try {
				const res0 = await fetch("user/name", {
					credentials: "include"
				});
				const Data0 = await res0.json();
				if (Data0.name)
				{
					try {
						const res = await fetch("chatUser", {
							method: "POST",
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								userName: Data0.name
							}),
							credentials: "include"
						});
						const Data = await res.json();
						if (Data)
							setData(prev => setUserData(prev, Data));
					}
					catch {
						throw new Error("error");
					}
				}
			}
			catch {
				return ;
			}
		}
		fetchData();
	}, [data.trigger]);
	useEffect(() => {
		socket.on("chatError", callBack);
		return () => {
			socket.off("chatError", callBack);
		}
	}, []);
	function useQuery() {
		return new URLSearchParams(useLocation().search);
	}
	function callBack() {
		if (!errorRef.current) {
			setError(true);
			setTimeout(() => {
				setError(false);
			}, 4000);
		}
	}
	if (notFound) {
		if (loading)
			return <div></div>;
		else
			return <NotFound />
	}
	return (
		<div className="flex h-[80vh] mx-4 p-5 rounded-lg bg-slate-900">
			{
				error && <div
					className="fixed top-20 left-1/2 -translate-x-1/2 z-50 h-10 bg-red-500
						text-white flex justify-center items-center p-5
						rounded-full animate-fade"
				>
					an error has occurred, please reload the page
				</div>
			}
			<Nav option={option} setOption={setOption} setData={setData} data={data}/>
			{
				option == "Private" ?
					<Private data={data} setData={setData} /> :
					<Groups
						data={data}
						setData={setData}
						privateJoin={name}
						setPrivateJoin={setName} />
				}
			{
				option == "Private" ?
					<ChatPrivate data={data} setData={setData} /> :
					<ChatGroups data={data} setData={setData}/>
			}
		</div>
	)
}

export default ChatApp;
