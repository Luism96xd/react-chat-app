import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const TextEditor = ({ id, title, field, endpoint }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState("");

  //const BASE_URL = "https://virtual-assistant.onrender.com";
  //const BASE_URL = "http://localhost:8080";

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      if (id !== null && id !== undefined && endpoint !== undefined) {
        try {
          console.log(endpoint);
          const response = await axios.get(endpoint);
          const content = (response.data[0]) ? response.data[0][field] : "";
          setContent(content);
        } catch (error) {
          console.error(error.message);
        }
        setLoading(false);
      }
    }
    getData();
  }, [id, endpoint, field])

  const handleSend = async () => {
    const registrationTokens = [];
    const q = query(collection(db, "users"), where("FCMToken", "!=", null));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let token = doc.data().FCMToken;
      console.log(token)
      registrationTokens.push(token);
    });
    const response = await axios.post(BASE_URL + '/api/sendMessages', {
      title: title,
      body: content,
      registrationTokens: registrationTokens
    });
    console.log(response);

    await axios.post(BASE_URL + '/api/sendMessage', {
      chatId: 1532038576,
      text: content
    });
    
    /*
    if (id !== null && id !== undefined) {
      try {
        const response = await axios.get(endpoint);
        if(response.data[0]){
          let response = await axios.put(endpoint, {
            context: content
          });
          console.log("PUT: ", response);
        }else{
          let response = await axios.post(endpoint, {
            context: content
          });
          console.log("POST: ", response);
        }
      } catch (error) {
        console.error(error.message);
      }
    }
    */
  }

  return (
    <div className='workspace'>
      {
        id &&
        <div>
          <h2>{title}</h2>
          <form action="">
            <ReactQuill className='textarea' onChange={value => setContent(value)} theme="snow" value={content}/>
          </form>
          <div>
            <button onClick={handleSend} className="btn btn-primary">Actualizar</button>
          </div>
        </div>
      }
    </div>
  )
}

export default TextEditor;