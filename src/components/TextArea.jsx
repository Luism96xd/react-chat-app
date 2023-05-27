import { doc, serverTimestamp, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { SubjectContext } from '../context/SubjectContext';
import { db } from '../firebase';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextArea = ({ subject }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState("");

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const { data } = useContext(SubjectContext);
  const { subject_id, name } = data.subject;

  /*
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
  */
  useEffect(() => {
    const getData = async () => {
      let id = subject.subject_id;
      //let name = subject.name.toLowerCase().replace(" ", "-");
      if (id !== null) {
        console.log("Fetching data from database");
        const ref = doc(db, "contextos", id);
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
    getData();
  }, [subject_id]);

  const handleSend = async (e) => {
    e.preventDefault();
    /*
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
    */

    const id = subject.subject_id.toString();
    const subjectName = name.toLowerCase().replace(/\s/g, "-");
    await setDoc(doc(db, "contextos", id), {
      subject_id: id,
      name: subjectName,
      contexto: content,
      lastModified: serverTimestamp()
    });

  }

  return (
    <div className='workspace'>
      {
        subject_id &&
        <form onSubmit={handleSend}>
          <h2>{(subject.subject_id) ? subject.name : "Configurar respuestas"}</h2>
          <ReactQuill className='textarea' onChange={value => setContent(value)} theme="snow" value={content} />
          <div>
            <button type="submit" className="btn btn-primary">Actualizar Respuestas</button>
          </div>
        </form>
      }
    </div>
  )
}

export default TextArea;