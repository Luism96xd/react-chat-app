import Edit from '../img/edit.svg';
import Delete from '../img/delete.svg';
import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { SubjectContext } from "../context/SubjectContext";
import { Modal } from "./Modal";
import { AddSubject } from "../components/AddSubject";


const Subjects = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const { data, dispatch } = useContext(SubjectContext);

    const BASE_URL = "https://virtual-assistant.onrender.com";
    //const BASE_URL = "http://localhost:8080";

    useEffect(() => {
        const getSubjects = async () => {
            setLoading(true);
            try {
                const endpoint = BASE_URL + '/subjects/';
                console.log(endpoint);
                const response = await axios.get(endpoint);
                setSubjects(response.data);
                console.log(response.data)
            } catch (error) {
                console.error(error.message);
            }
            setLoading(false);

            /*
            const items = [];
            console.log("Fetching Subjects from database");
            const q = query(collection(db, "topicos"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            */
            //setSubjects(items);
        }
        getSubjects();
    }, [subjects])

    const handleSelect = (subject) => {
        dispatch({ type: "CHANGE_SUBJECT", payload: subject });
    }

    const handleCreate = () => {
        dispatch({ type: "CHANGE_SUBJECT", payload: {} });
        setIsOpen(true);
    }

    return (
        <div className="sidebar">
            <ul className="list">
                {loading && <div>Loading...</div>}
                {!loading && (
                    Object.entries(subjects)?.sort((a, b) => b[1].creation_date - a[1].creation_date)
                        .map((subject) => {
                            return (
                                <li className="list-item"
                                    key={subject[1].id_subject}
                                    onClick={() => handleSelect(subject[1])}>
                                    <span>{subject[1].name}</span>
                                    <div className="icons">
                                        <img className="icon" src={Edit} alt="edit" onClick={() => setIsOpen(true)} />
                                        <img className="icon" src={Delete} alt="delete" onClick={() => setIsOpen(true)} />
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
                <Modal title={(data.subject.id_subject) ? data.subject.name : "Agregar nuevo Tópico"}>
                    <AddSubject id={data.subject.id_subject} setIsOpen={setIsOpen} />
                </Modal>
            }
        </div>
    )
}

export default Subjects;