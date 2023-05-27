import { addDoc, updateDoc, collection, doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import ListManager from "../components/ListManager";
import { db } from '../firebase';
import axios from 'axios';
import { SubjectContext } from '../context/SubjectContext';

export const AddSubject = ({ id, setIsOpen }) => {
    const [subject, setSubject] = useState([]);
    const [title, setTitle] = useState([]);

    const { data } = useContext(SubjectContext);
    const { subject_id } = data.subject;

    const [inputFields, setInputFields] = useState([
        { question: '' }
    ]);

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    /*
    useEffect(() => {
        const getData = async () =>{
            setLoading(true);
            if (id == null){
                return;
            }
            try {
                console.log("Fetching data");
                let endpoint = BASE_URL + id;
                const response = await axios.get(endpoint);
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
    */
    useEffect(() => {
        const getData = async () => {
            if (id == null) {
                console.log("Subject ID is null.")
                return;
            }
            console.log("Fetching data from database");
            const ref = doc(db, "topicos", id);
            const docSnap = await getDoc(ref);

            if (docSnap.exists()) {
                const subject = docSnap.data();
                setTitle(subject.nombre);
            } else {
                console.log("No such document!");
            }

        }

        return () => {
            getData();
        }
    }, [id]);

    const handleFormChange = (newValues) => {
        setInputFields(newValues);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const name = e.target[0].value;
        console.log(inputFields);
        createIntent(name, inputFields);
        saveToFirebase(name);
        /*
        try {
            const endpoint = BASE_URL + "/subjects/";
            console.log(endpoint)
            await axios.post(endpoint, {name, description});
            window.location.reload(false);
        }catch (error) {
            console.error(error.message);
        }
        */
        setIsOpen(false);
    }
    const saveToFirebase = async (name) => {
        try {
            const res = await addDoc(collection(db, "topicos"), {
                name: name.toLowerCase().replace(/\s/g, "-"),
                displayName: name,
                creation_date: new Date().toISOString()
            });
            await updateDoc(doc(db, "topicos", res.id), {
                subject_id: res.id,
            });
            sessionStorage.removeItem('temas');
            window.location.reload(false);
        } catch (error) {
            console.log(error);
        }
    }

    const createIntent = async (name, inputFields) => {
        //Crear un nuevo intent de Dialogflow
        let phrases = inputFields.map(row => row.question);
        await axios.post(BASE_URL + "/intents/", {
            displayName: name,
            trainingPhrasesParts: phrases,
            messageTexts: ["Tu consulta será resuelta a la brevedad posible"]
        });
    }

    return (
        <form onSubmit={handleCreate} action="POST" className='form'>
            <div className='form-inline'>
                <label htmlFor="name">Nombre</label>
                <input type="text" id="name" defaultValue={subject.name} required />
            </div>
            <h2 className='text-small my-16'>Escribe algunas preguntas de ejemplo</h2>
            <div className='list-container' style={{ height: 200, overflowY: 'auto' }}>
                <ListManager
                    initialValues={inputFields}
                    text={'question'}
                    onFormChange={handleFormChange}
                />
            </div>
            <div className='buttons'>
                <button type="submit" className={`btn btn-${(id) ? 'success' : "primary"}`}>
                    {(id) ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" className="btn btn-default" onClick={() => setIsOpen(false)}>
                    Cancel
                </button>
            </div>
        </form>
    )
}
