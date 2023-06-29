import {signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import { auth, db } from "../firebase";

function Login() {

    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      const email = e.target[0].value;
      const password = e.target[1].value;
      try{
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const id = userCredentials.user.uid;
        const docSnap = await getDoc(doc(db, "users", id));

        navigate("/chat");

      }catch(error){
        setError(true);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      }
      
    }

  
    return (
      <div className="form-container">
        <div className="form-wrapper">
            <h1 className="logo">Cassandra Virtual Assistant</h1>
            <span className="title">Iniciar sesión</span>
            <form  onSubmit={handleSubmit}>
                <input type="email" name="email" id="email" placeholder="Correo electrónico"/>
                <input type="password" name="password" id="password" placeholder="Contraseña"/>
                <button id="sign-in-button">Iniciar sesión</button>
            </form>
            { error && <span>Algo salió mal, intente nuevamente</span> }
            <p>¿Aún no tienes una cuenta? <Link to="/register">Registrarme</Link></p>
        </div>
      </div>
    );
}

export default Login;
