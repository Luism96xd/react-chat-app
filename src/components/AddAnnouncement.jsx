import React, { useContext, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../scss/pages/admin.scss'
import axios from 'axios';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';

const AddAnnouncement = ({ id }) => {
    const { currentUser } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [open, setIsOpen] = useState(true);

    const BASE_URL = "https://virtual-assistant.onrender.com";
    //const BASE_URL = "http://localhost:8080";

    const handleSend = async (e) => {
        e.preventDefault();
        /*
        if (id !== null && id !== undefined) {
            try {
                let endpoint = BASE_URL + `/announcements/${id}`;
                let response = await axios.put(endpoint, {
                    title: name,
                    content: description
                });
                console.log("PUT: ", response);
            }
            catch (error) {
                console.log(error);
            }
        } else {
            try {
                let endpoint = BASE_URL + '/announcements/';
                let response = await axios.post(endpoint, {
                    title: name,
                    content: description,
                    userId: currentUser.uid
                });
                console.log("POST: ", response);
            } catch (error) {
                console.log(error.message)
            }
        }
        */
        /*
        const registrationTokens = [];
        const q = query(collection(db, "users"), where("FCMToken", "!=", null));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let token = doc.data().FCMToken;
            console.log(token)
            registrationTokens.push(token);
        });
        const response = await axios.post(BASE_URL + '/api/sendMessages', {
            title: name,
            body: description,
            registrationTokens: registrationTokens
        });
        */

        await axios.post(BASE_URL + '/api/sendMessage', {
            chatId: -1001877599861,
            text: description
        });

    }
    return (
        open &&
        <div>
            <form onSubmit={handleSend} className="form">
                <div>
                    <label htmlFor="name">Nombre</label>
                </div>
                <div>
                    <input type="text" id="name" onChange={value => setName(value)} defaultValue={name} required />
                </div>
                <div>
                    <label htmlFor="description">Descripción</label>
                </div>
                <div>
                    <ReactQuill className='textarea' onChange={value => setDescription(value)} theme="snow" value={description} />
                </div>
                <div className='buttons'>
                    <button type="submit"
                        className={`btn btn-${(id) ? 'success' : "primary"}`}>
                        {(id) ? 'Actualizar' : 'Crear'}
                    </button>
                    <button type="button" className="btn btn-cancel" onClick={() => setIsOpen(false)}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddAnnouncement