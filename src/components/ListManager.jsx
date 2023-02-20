import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { SubjectContext } from '../context/SubjectContext';
import Add from '../img/add.svg';
import Delete from '../img/delete.svg';

const ListManager = ({ subject }) => {
    const [questions, setQuestions] = useState([]);
    const [inputFields, setInputFields] = useState([
        { question: '', id_question: 1, id_subject: subject.id_subject }
    ]);
    const { data } = useContext(SubjectContext);
    const { id_subject } = data.subject;
    
    const BASE_URL = "https://virtual-assistant.onrender.com";

    useEffect(() => {
        const getQuestions = async () => {
            if (id_subject!== null && id_subject !== undefined) {
                let endpoint = BASE_URL + "/subjects/" + subject.id_subject + "/questions/";
                console.log(endpoint);
                try {
                    const response = await axios.get(endpoint);
                    setQuestions(response.data);
                    if(response.data.length > 1){
                        setInputFields(response.data);
                    }else{
                        setInputFields([{ question: '', id_question: 0, id_subject: 0 }])
                    }
                    console.log(response.data)
                } catch (error) {
                    console.error(error.message);
                }
            }
        }
        getQuestions();
    }, [id_subject])

    const addFields = (e) => {
        e.preventDefault();
        let newfield = { question: '', id_subject: subject.id_subject }
        setInputFields([...inputFields, newfield]);
        console.log(inputFields)
    }

    const handleFormChange = (index, event) => {
        let data = [...inputFields];
        data[index][event.target.name] = event.target.value;
        data[index]["id_question"] = parseInt(index + 1);
        data[index]["id_subject"] = parseInt(subject.id_subject);
        setInputFields(data);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputFields);
        let endpoint = BASE_URL + "/subjects/" + subject.id_subject + "/questions/";
        try {
            const response = await axios.post(endpoint, inputFields);
            console.log(response)
        } catch (error) {
            console.log(error);
        }

    }

    const removeFields = (index) => {
        let data = [...inputFields];
        data.splice(index, 1)
        setInputFields(data)
    }

    return (
        <div style={{ width: '100%' }}>
            {
                subject.id_subject &&
                <div>
                    <h2 title={'Preguntas frecuentes relacionadas con ' + subject.name}>Preguntas</h2>
                    <form action="">
                        {
                            inputFields.map((input, index) => {
                                return (
                                    <div key={index} className='flex question-row'>
                                        <input type="text"
                                            defaultValue={questions[index]?.question}
                                            onChange={event => handleFormChange(index, event)}
                                            name="question"
                                        />
                                        <div className='flex'>
                                            <button onClick={addFields}>
                                                <img src={Add} alt="Añadir una nueva pregunta" />
                                            </button>
                                            <button onClick={() => removeFields(index)}>
                                                <img src={Delete} alt="Borrar pregunta" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </form>
                    <div>
                        <button onClick={handleSubmit} className="btn btn-primary">Actualizar Preguntas</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default ListManager;