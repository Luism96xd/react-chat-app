import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header>
        <nav>
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