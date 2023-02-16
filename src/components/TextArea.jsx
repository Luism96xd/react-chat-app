import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
//import { SubjectContext } from '../context/SubjectContext';
import {db} from '../firebase';

const TextArea = () => {
  const [content, setContent] = useState("");

  //const {subject} = useContext(SubjectContext);
  //console.log(subject);

  const handleSend = async ()  => {
    await updateDoc(doc(db, "contextos", 'servicio-comunitario'), {
      contexto: content,
      createdAt: serverTimestamp()
    });
  }

  return (
    <div className='workspace'>
        <h1>Servicio Comunitario</h1>
        <form action="">
            <textarea onChange={e => setContent(e.target.value)} cols="40" rows="10"></textarea>
        </form>
        <div>
            <button onClick={handleSend} className="btn btn-primary">Actualizar</button>
        </div>
    </div>
  )
}

export default TextArea;