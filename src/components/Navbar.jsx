import React from 'react';
import { Link } from "react-router-dom";
import Logo from '../img/logo-unitec-horizontal.png';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';

const Navbar = () => {

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("An error happened on Sign Out", error);
    }
  }

  return (
    <header>
      <span className="logo">
        <img src={Logo} alt="UNITEC Logo" />
      </span>
      <nav>
        <ul className="list">
          <li className="list-item"><Link to="/admin">Home</Link></li>
          <li className="list-item"><Link to="/news">Noticias</Link></li>
          <li className="list-item"><Link to="/tickets">Casos</Link></li>
          <li className="list-item"><Link to="/chat">Chat</Link></li>
          <li className="list-item"><Link to="/general">Contacto</Link></li>
        </ul>
        <button className='btn' onClick={logout}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>
      </nav>
    </header>
  )
}

export default Navbar