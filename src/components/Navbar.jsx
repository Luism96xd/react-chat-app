import React from 'react'
import { Link } from "react-router-dom";
import Logo from '../img/logo-unitec-horizontal.png';

const Navbar = () => {
  return (
    <header>
        <nav>
            <span className="logo">
              <img src={Logo} alt="UNITEC Logo" />
            </span>
            <ul className="list">
                <li className="list-item">Home</li>
                <li className="list-item">Noticias</li>
                <li className="list-item"><Link to="/">Chat</Link></li>
                <li className="list-item">Contacto</li>
            </ul>
        </nav>
    </header>
  )
}

export default Navbar