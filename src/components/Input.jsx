import React, { useContext, useState } from 'react'
import { doc, updateDoc, arrayUnion, Timestamp, serverTimestamp } from "firebase/firestore";
import Img from '../img/img.png';
import Attach from '../img/attach.png';
import { uuidv4 } from '@firebase/util';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage, db } from '../firebase';

const Input = () => {
  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [error, setError] = useState(false);

  const handleSend = async () => {
    if (img){ 
      handleImage(img);
    }else{
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuidv4(),
          text: text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        })
      });
    }
    //Actualizar mi último mensaje enviado
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId+".lastMessage"]: {
        text: text,
      },
      [data.chatId+".date"]: serverTimestamp(),
    })
    //Actualizar el último mensaje recibido por el otro usuario
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId+".lastMessage"]: {
        text: text,
      },
      [data.chatId+".date"]: serverTimestamp(),
    })
    
    setText("");
    setImg(null);
  }

  const handleImage = (img) =>{
    const storageRef = ref(storage, "attachments/" + Timestamp.now());

    const uploadTask = uploadBytesResumable(storageRef, img);

    uploadTask.on(
      //Manejar errores
      (error) => {
        setError(true);
        console.log(error);
      }, 
      //Carga exitosa
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
          console.log('File available at', downloadURL);
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuidv4(),
              text: text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL
            })
          });
        });
      
      }

    );//EndOn
  }

  const handleKey = (e) =>{
    if (e.code === "Enter"){
      console.log("enter");
      handleSend();
  };
  }

  return (
    <div className="input">
        <input type="text" 
          placeholder="Escribe un mensaje..." 
          onChange={e => setText(e.target.value)}
          value={text}
          onKeyDown={handleKey}
        />
        <div className="send">
            <img 
                src={Img} 
                alt=""
                onChange={e => setImg(e.target.files[0])}
            />
            <input 
                type="file" 
                name="" id="file" 
                style={{display: 'none'}} 
                onChange={e => setImg(e.target.files[0])}
            />
            <label htmlFor="file">
                <img src={Attach} alt="" />
            </label>
            <button onClick={handleSend}>Enviar</button>
        </div>
    </div>
  )
}

export default Input;
