import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Navbar = () =>{

    const {currentUser} = useContext(AuthContext);

    return (
        <div className="navbar">
            <span className="logo">Assistant</span>
            <div className="user">
                <img src={currentUser.photoURL} alt="User" />
                <span>{currentUser.displayName}</span>
                <button onClick={() => signOut(auth)}>Cerrar sesión</button>
            </div>
        </div>
    )
}

export default Navbar;