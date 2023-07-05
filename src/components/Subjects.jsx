import Edit from '../img/edit.svg';
import Delete from '../img/delete.svg';
import React, { useContext, useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { SubjectContext } from "../context/SubjectContext";
import { Modal } from "./Modal";
import { AddSubject } from "../components/AddSubject";
import SubjectAPI from '../api/SubjectsAPI';


const Subjects = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const { data, dispatch } = useContext(SubjectContext);

    useEffect(() => {
        const getSubjects = async () => {
            setLoading(true);
            /*
            SubjectAPI.getAll().then((response) => {
                console.log(response.data)
                setSubjects(response.data);
            });
            */
            const items = [];
            const cachedData = sessionStorage.getItem('temas');
            if (cachedData) {
                console.log("Using cached data");
                setSubjects(JSON.parse(cachedData));
                setLoading(false)
                return Promise.resolve(JSON.parse(cachedData));
            } else {
                console.log("Fetching Subjects from database");
                const q = query(collection(db, "topicos"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    items.push(doc.data());
                });
                setSubjects(items);
                console.log('Saving it into cache')
                sessionStorage.setItem('temas', JSON.stringify(items));
                setLoading(false);
            }
        }
        getSubjects();
    }, [])

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
                    subjects.sort((a, b) => b.creation_date - a.creation_date)
                        .map((subject) => {
                            return (
                                <li className="list-item"
                                    key={subject.subject_id}
                                    onClick={() => handleSelect(subject)}>
                                    <span>{subject.displayName}</span>
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