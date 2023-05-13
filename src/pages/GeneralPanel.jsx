import "../scss/pages/admin.scss";
import React, { useEffect, useState } from "react";
import KeyValueComponent from "../components/KeyValueComponent";
import Navbar from "../components/Navbar";
import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

function GeneralPanel() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const items = [];
            const cachedData = sessionStorage.getItem('emails');
            if (cachedData) {
                console.log("Using cached data");
                setEmails(JSON.parse(cachedData));
            } else {
                console.log("Fetching Subjects from database");
                const q = query(collection(db, "correos"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const { departamento: key, correo: value } = doc.data();
                    items.push({ key, value });
                });
                console.log('Saving it into cache')
                sessionStorage.setItem('emails', JSON.stringify(items));
                setEmails(items);
            }
            setLoading(false);
        }
        getData();
    }, [])

    const saveToFirebase = async (data) => {
        console.log(data.key)
        const document = data.key.toString().toLowerCase();
        const docRef = doc(db, 'correos', document);
        await setDoc(docRef, {
            'departamento': data.key,
            'correo': data.value,
        })
        sessionStorage.removeItem('emails');
    }

    return (
        <div className="admin">
            <Navbar />
            <div className="container grid">
                <aside className='list-container'>

                </aside>
                <div className="card">
                    <div className="column">
                        <h2>Departamento - Correo</h2>
                        {loading && <span>Loading...</span>}
                        {(emails.length > 1) && <KeyValueComponent
                            saveFunction={saveToFirebase}
                            initialKeyValues={emails}
                        />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GeneralPanel;