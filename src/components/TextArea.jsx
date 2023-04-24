import { doc, serverTimestamp, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { SubjectContext } from '../context/SubjectContext';
import { db } from '../firebase';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextArea = ({ subject }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState("");

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const { data } = useContext(SubjectContext);
  const { subject_id } = data.subject;

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      if (subject_id !== null && subject_id !== undefined) {
        try {
          let endpoint = BASE_URL + "/subjects/" + subject_id + "/descriptions/";
          console.log(endpoint)
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
  }, [subject_id])

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
    if (subject_id !== null && subject_id !== undefined) {
      const endpoint = BASE_URL + "/subjects/" + subject_id + "/descriptions/";
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
    
    const id = subject.subject_id.toString();
    const name = subject.name.toLowerCase().replace(/\s/g, "-");
    await setDoc(doc(db, "contextos", name), {
      subject_id: id,
      contexto: content,
      lastModified: serverTimestamp()
    });
    
  }

  return (
    <div className='workspace'>
      {
        subject_id &&
        <div>
          <h2>{(subject.subject_id) ? subject.name : "Configurar respuestas"}</h2>
          <form action="">
            <ReactQuill className='textarea' onChange={value => setContent(value)} theme="snow" value={content}/>
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