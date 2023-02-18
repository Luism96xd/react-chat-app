import {addDoc, updateDoc, collection, doc, getDoc} from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { db } from '../firebase';
import axios from 'axios';

export const AddSubject = ({id, setIsOpen}) => {
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState([]);

    useEffect(() => {
        const getData = async () =>{
            setLoading(true);
            if (id == null){
                return;
            }
            try {
                console.log("Fetching data");
                const response = await axios.get('https://virtual-assistant.onrender.com/subjects/'+id);
                setSubject(response.data[0]);
            }catch (error) {
                console.error(error.message);
            }
            setLoading(false);
        }
        return () => {
            getData();
        }
        
    }, [id]);
    /*
    useEffect(() => {
        const getData = async () =>{
            if (id == null){
                console.log("Subject ID is null.")
                return;
            }
            console.log("Fetching data from database");
            const ref = doc(db, "topicos", id);
            const docSnap = await getDoc(ref);
        
            if (docSnap.exists()) {
                const subject = docSnap.data();
                setTitle(subject.nombre);
                setContent(subject.descripcion);
        
            } else {
                console.log("No such document!");
            }
            
        }
    
      return () => {
        getData();
      }
    }, [id])
    */

    const handleCreate = async (e) =>{
        e.preventDefault();
        const name = e.target[0].value;
        const description = e.target[1].value;

        try {
            await axios.post(
                'https://virtual-assistant.onrender.com/subjects/', {name, description}
            );
        }catch (error) {
            console.error(error.message);
        }
        setIsOpen(false)
        /*
        try{
            const res = await addDoc(collection(db, "topicos"), { 
                nombre: name,
                descripcion: description
            });
            await updateDoc(doc(db, "topicos", res.id), { 
                id: res.id,
            });
            setIsOpen(false)
        }catch(error){
            console.log(error);
        }
        */

    }
    return (
    <div>
        <form onSubmit={handleCreate} action="POST" className='form'>
                <div className='form-inline'>
                    <label htmlFor="name">Nombre</label>
                    <input type="text" id="name" defaultValue={subject.name} required/>
                </div>
                <div className='form-inline'>
                    <label htmlFor="description">Descripción</label>
                    <textarea name="description" id="description" cols="30" rows="10" defaultValue={subject.description}></textarea>
                </div>
                
                <div className='buttons'>
                    <button type="submit" className={`btn btn-${(id)? 'success' : "primary"}`}>
                        {(id)? 'Actualizar' : 'Crear'}
                    </button>
                    <button type="button" className="btn btn-cancel" onClick={() => setIsOpen(false)}>
                        Cancel
                    </button>
                </div>
        </form>
    </div>
    )
}
