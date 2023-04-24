import React from "react";
import Topbar from "./Topbar";
import Chats from "./Chat/Chats";
import SearchBar from './Chat/SearchBar';

const Sidebar = () =>{
    return (
        <div className="sidebar">
            <Topbar/>
            <SearchBar/>
            <Chats/>
        </div>
    )
}

export default Sidebar;