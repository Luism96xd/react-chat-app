import React from "react";
import Topbar from "./Topbar";
import Chats from "./Chats";
import Search from "./Search";

const Sidebar = () =>{
    return (
        <div className="sidebar">
            <Topbar/>
            <Search/>
            <Chats/>
        </div>
    )
}

export default Sidebar;