import { doc, serverTimestamp, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import "../components/_ripples.scss";
import createRipples from "../ripples";
import { SubjectContext } from '../context/SubjectContext';
import { db } from '../firebase';
import axios from 'axios';

const TextArea = ({ subject }) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState("");

  //const { data } = useContext(SubjectContext);

  /*
  useEffect(() => {
    const getData = async () =>{
      setLoading(true);
      if (data.subject.id_subject !== undefined){
        try {
          const response = await axios.get(
            'https://virtual-assistant.onrender.com/subjects/'+ data.subject.id_subject + "/descriptions/"
          );
          setContent(response.data[0]?.context);
        } catch (error) {
          console.error(error.message);
        }
        setLoading(false);
      }
    }
    return () => {
        getData();
    }
}, [data.subject])
*/


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

  const handleSend = async () => {
    const id = subject.id_subject.toString();
    const name = subject.name.toLowerCase().replace(" ", "-");
    await setDoc(doc(db, "contextos", name), {
      id_subject: id,
      contexto: content,
      lastModified: serverTimestamp()
    });
  }

  return (
    <div className='workspace'>
      <h1>{(subject) ? subject.name : "Configurar respuestas"}</h1>
      <form action="">
        <textarea onChange={e => setContent(e.target.value)} cols="40" rows="10" defaultValue={content}></textarea>
      </form>
      <div>
        <button onClick={handleSend} className="btn btn-primary">Actualizar</button>
      </div>
    </div>
  )
}

export default TextArea;