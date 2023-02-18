import Edit from '../img/edit.svg';
import Delete from '../img/delete.svg';
import React, { useContext, useState, useEffect} from "react";
import axios from 'axios';
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { SubjectContext } from "../context/SubjectContext";
import { Modal } from "./Modal";
import { AddSubject } from "../components/AddSubject";


const Subjects = () =>{
    const [isOpen, setIsOpen] = useState(false);
    const {data, dispatch} = useContext(SubjectContext);
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
  
    useEffect(() => {
        const items = [];
        const getSubjects = async () =>{
            setLoading(true);
            try {
                const response = await axios.get('https://virtual-assistant.onrender.com/subjects/');
                setSubjects(response.data);
                console.log(response.data)
              } catch (error) {
                console.error(error.message);
            }
            setLoading(false);
            
            /*
            console.log("Fetching Subjects from database");
            const q = query(collection(db, "topicos"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            */
            //setSubjects(items);
        }
        return () => {
            getSubjects();
        }
    }, [])
    
    const handleSelect = (subject) => {
        dispatch({type: "CHANGE_SUBJECT", payload: subject });
    }
    
    const handleCreate  = () => {
        dispatch({type: "CHANGE_SUBJECT", payload: {} });
        setIsOpen(true);
    }
    
    return (
        <div className="sidebar">
            <ul className="list">
                {loading && <div>Loading...</div>}
                {!loading && (
                    Object.entries(subjects)?.sort((a, b) => b[1].createdAt - a[1].createdAt)
                        .map((subject) => {
                    return (
                        <li className="list-item" 
                            key={subject[1].id_subject} 
                            onClick={() => handleSelect(subject[1])}>
                            <span>{subject[1].name}</span>
                            <div className="icons">
                                <img className="icon" src={Edit} alt="edit" onClick={() => setIsOpen(true)}/>
                                <img className="icon" src={Delete} alt="delete" onClick={() => setIsOpen(true)}/>
                            </div>
                        </li>
                        )
                    })
                    )
                }    
            
            </ul>
            <div>
                <button className="btn btn-default" onClick={handleCreate}>Agregar Nuevo</button>
            </div>
            {isOpen && 
                <Modal title={(data.subject.id_subject)? data.subject.name : "Agregar nuevo Tópico"}>
                    <AddSubject id={data.subject.id_subject} setIsOpen={setIsOpen}/>
                </Modal>
            }
        </div>
    )
}

export default Subjects;