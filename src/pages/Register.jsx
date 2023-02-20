import React, { useState } from "react";
import {Link} from 'react-router-dom';
import { auth, storage, db } from "../firebase";
import {createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import AddImage from "../img/addAvatar.png";

import { useNavigate } from 'react-router-dom';

function Register() {
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      const displayName = e.target[0].value;
      const email = e.target[1].value;
      const password = e.target[2].value;
      const file = e.target[3].files[0];

      try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create the file metadata
        /** @type {any} */
        const metadata = {
          contentType: 'image/jpeg'
        };

        const storageRef = ref(storage, 'images/' + displayName);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        uploadTask.on(
          //Handle Errors
          (error) => {
            setError(true);
            console.log(error);
          }, 
          //Carga exitosa
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
              console.log('File available at', downloadURL);
              await updateProfile(user, {
                displayName: displayName,
                photoURL: downloadURL
              });

              await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName: displayName,
                email: email,
                photoURL: downloadURL
              });

              await setDoc(doc(db, "userChats", user.uid), {});
              navigate("/");
            
            });
          
          }

        );

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
            <span className="title">Registro</span>
            <form onSubmit={handleSubmit} action="">
                <input type="text" id="display-name" placeholder="Nombre de usuario"/>
                <input type="email" name="email" id="email" placeholder="Correo electrónico"/>
                <input type="password" name="password" id="password" placeholder="Contraseña"/>
                <input style={{display: "none"}} type="file" name="profie-photo" id="profie-photo" placeholder="Foto de perfil"/>
                <label htmlFor="profie-photo">
                   <img src={AddImage} className="icon" alt="Add a profile photo" />
                   <span>Añade una foto de perfil</span>
                </label>
                <button id="sign-in-button">Registrar</button>
                { error && <span>Algo salió mal, intente nuevamente</span> }
            </form>
            <p>¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link></p>
        </div>
      </div>
    );
}

export default Register;
