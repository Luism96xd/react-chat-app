import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { SubjectContext } from '../context/SubjectContext';
import Add from '../img/add.svg';
import Delete from '../img/delete.svg';

const ListManager = ({ subject }) => {
    const [questions, setQuestions] = useState([]);
    const [lastId, setLastId] = useState(1);
    const [inputFields, setInputFields] = useState([
        { question: '', id_question: 1, subject_id: subject.subject_id }
    ]);
    const { data } = useContext(SubjectContext);
    const { subject_id } = data.subject;

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        const getQuestions = async () => {
            setLastId(1);

            if (subject_id !== null && subject_id !== undefined) {
                let endpoint = BASE_URL + "/subjects/" + subject_id + "/questions/";
                console.log(endpoint);
                try {
                    const response = await axios.get(endpoint);
                    setQuestions(response.data);
                    if (response.data.length > 0) {
                        setInputFields(response.data);
                        console.log("Last id: " + response.data.at(-1).id_question);
                        setLastId(response.data.at(-1).id_question);
                    } else {
                        setInputFields([{ question: '', id_question: 1, subject_id: subject_id }])
                    }
                    console.log(response.data)
                } catch (error) {
                    console.error(error.message);
                }
            }
        }
        getQuestions();
    }, [subject_id])

    const addFields = (e) => {
        e.preventDefault();
        let newfield = { question: '', subject_id: subject.subject_id }
        setLastId(lastId + 1);
        setInputFields([...inputFields, newfield]);
    }

    const handleFormChange = (index, event) => {
        let data = [...inputFields];
        data[index][event.target.name] = event.target.value;
        data[index]["id_question"] = (data[index]["id_question"]) ? data[index]["id_question"] : parseInt(index + 1);
        data[index]["subject_id"] = parseInt(subject.subject_id);
        setInputFields(data);
    }

    const removeFields = (e, index) => {
        e.preventDefault();
        let data = [...inputFields];
        data.splice(index, 1);
        setLastId(lastId - 1);
        setInputFields(data);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputFields);
        let endpoint = BASE_URL + "/subjects/" + subject.subject_id + "/questions/";
        try {
            inputFields.forEach(async (object) => {
                let endpoint2 = endpoint + object.id_question;
                const response = await axios.get(endpoint2);

                if (response.data[0]) {
                    let response = await axios.put(endpoint2, {
                        question: object.question,
                        id_question: object.id_question
                    });
                    console.log("PUT: ", response);
                } else {
                    let response = await axios.post(endpoint, {
                        question: object.question,
                        id_question: object.id_question
                    });
                    console.log("POST: ", response);
                }
            });
            //Crear un nuevo intent de Dialogflow
            let phrases = inputFields.map(row => row.question);
            await axios.post(BASE_URL + "/intents/", {
                displayName: subject.name,
                trainingPhrasesParts: phrases,
                messageTexts: ["Tu consulta será resuelta a la brevedad posible"]
            });

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div style={{ width: '100%' }}>
            {
                subject.subject_id &&
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
                                            <button onClick={(e) => removeFields(e, index)}>
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