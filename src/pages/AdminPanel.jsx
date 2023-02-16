import "../admin.scss"
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import TextArea from "../components/TextArea";
import Subjects from "../components/Subjects";
import { SubjectContext } from "../context/SubjectContext";

function Panel() {
  const {data} = useContext(SubjectContext);
  return (
        <div className="admin">
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
            <div className="container">
                <Subjects/>
                <TextArea subject={data.subject}/>
            </div>
        </div>  
  );
}

export default Panel;