import React from "react";
import Header from "../../../Layout/Header/Header";

function Leaderbord({setAvatar, avatar} : {setAvatar: Function, avatar: string}) {
    return (
        <div>
            <Header setAvatar={setAvatar} avatar={avatar}/>
            <div className="center " >
                <h1>Leaderbord</h1>
            </div>

        </div>
    );
}

export default Leaderbord