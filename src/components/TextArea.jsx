import { doc, serverTimestamp, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { SubjectContext } from '../context/SubjectContext';
import { db } from '../firebase';
import axios from 'axios';

const TextArea = ({ subject }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState("");

  const BASE_URL = "https://virtual-assistant.onrender.com";
  const { data } = useContext(SubjectContext);
  const { id_subject } = data.subject;

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      if (id_subject !== null && id_subject !== undefined) {
        try {
          let endpoint = BASE_URL + "/subjects/" + id_subject + "/descriptions/";
          const response = await axios.get(endpoint);
          const description = (response.data[0]) ? response.data[0].context : "";
          setContent(description);
        } catch (error) {
          console.error(error.message);
        }
        setLoading(false);
      }
    }
    getData();
  }, [id_subject])


  /*
  useEffect(() => {
    const getData = async () => {
      //let id = subject.id_subject;
      let name = subject.name.toLowerCase().replace(" ", "-");
      if (name !== "") {
        console.log("Fetching data from database");
        console.log("Name", name);
        const ref = doc(db, "contextos", name);
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data);
          setTitle(subject.name);
          setContent(data.contexto);

        } else {
          console.log("No such document!");
        }
      }
    }
    return () => {
      getData();
    }
  }, [subject.name]);
  */

  const handleSend = async () => {
    if (id_subject !== null && id_subject !== undefined) {
      const endpoint = BASE_URL + "/subjects/" + id_subject + "/descriptions/";
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
    
    const id = subject.id_subject.toString();
    const name = subject.name.toLowerCase().replace(/\s/g, "-");
    await setDoc(doc(db, "contextos", name), {
      id_subject: id,
      contexto: content,
      lastModified: serverTimestamp()
    });
    
  }

  return (
    <div className='workspace'>
      {
        id_subject &&
        <div>
          <h2>{(subject.id_subject) ? subject.name : "Configurar respuestas"}</h2>
          <form action="">
            <textarea onChange={e => setContent(e.target.value)} 
              cols="100" rows="10" 
              defaultValue={content}>
            </textarea>
          </form>
          <div>
            <button onClick={handleSend} className="btn btn-primary">Actualizar Respuestas</button>
          </div>
        </div>
      }
    </div>
  )
}

export default TextArea;