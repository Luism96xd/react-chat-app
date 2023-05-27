import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { SubjectContext } from '../context/SubjectContext';
import Add from '../img/add.svg';
import Delete from '../img/delete.svg';

const ListManager = ({ initialValues, text, onFormChange }) => {
    const [items, setItems] = useState(initialValues);
    const [lastId, setLastId] = useState(1);

    const { data } = useContext(SubjectContext);
    const { subject_id } = data.subject;

    const BASE_URL = process.env.REACT_APP_BASE_URL;
    /*
    useEffect(() => {
        const getQuestions = async () => {
            setLastId(1);

            if (subject_id !== null && subject_id !== undefined) {
                let endpoint = BASE_URL + "/subjects/" + subject_id + "/questions/";
                console.log(endpoint);
                try {
                    const response = await axios.get(endpoint);
                    if (response.data.length > 0) {
                        setItems(response.data);
                        console.log("Last id: " + response.data.at(-1).question_id);
                        setLastId(response.data.at(-1).question_id);
                    } else {
                        setItems([{ question: '', question_id: 1, subject_id: subject_id }])
                    }
                    console.log(response.data)
                } catch (error) {
                    console.error(error.message);
                }
            }
        }
        getQuestions();
    }, [subject_id])
    */
    const addFields = (e) => {
        e.preventDefault();
        let newfield = {};
        setLastId(lastId + 1);
        setItems([...items, newfield]);
        console.log(items);
    }

    const handleFormChange = (index, event) => {
        let data = [...items];
        data[index]['id'] = index;
        data[index][text] = event.target.value;
        setItems(data);
        onFormChange(data);
        console.log(items);
    }

    const removeFields = (e, index) => {
        e.preventDefault();
        if (items.length > 1) {
            let data = [...items];
            data.splice(index, 1);
            setLastId(lastId - 1);
            setItems(data);
        }
    }

    return (
        <div style={{ width: '100%', padding: '8px' }}>
            {
                items.map((item, index) => {
                    return (
                        <div key={index} className='flex question-row'>
                            <input type="text"
                                defaultValue={item[text]}
                                onChange={event => handleFormChange(index, event)}
                                name={item[text]}
                            />
                            <div className='flex'>
                                <button onClick={addFields}>
                                    <img src={Add} alt="Añadir una nueva pregunta" />
                                </button>
                                <button onClick={(e) => removeFields(e, index)}>
                                    <img src={Delete} alt="Borrar pregunta" />
                                </button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ListManager;