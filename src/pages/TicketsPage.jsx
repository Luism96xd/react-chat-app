import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, getDocs, query } from "firebase/firestore";
import Navbar from '../components/Navbar';
import FilterableList from '../components/FilterableList';
import Ticket from "../components/Ticket";
import '../scss/pages/tickets.scss';

const TicketsPage = () => {
    const [loading, setLoading] = useState(false);
    const [preguntas, setPreguntas] = useState([]);

    const data = [
        {
            name: "John Doe",
        },
        {
            name: "Jane Doe",
        },
        {
            name: "Luis Rivas",
        },
    ];


    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const items = [];
            const cachedData = sessionStorage.getItem('tickets');
            if (cachedData) {
                console.log("Using cached data");
                setPreguntas(JSON.parse(cachedData));
                return Promise.resolve(JSON.parse(cachedData));
            } else {
                console.log("Fetching Subjects from database");
                const q = query(collection(db, "preguntas"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const { pregunta, email, respuesta, feedback } = doc.data();
                    items.push({ name: "Luis", email: email, question: pregunta, answer: respuesta, feedback: feedback });
                });
                console.log('Saving it into cache')
                sessionStorage.setItem('tickets', JSON.stringify(items));
                setPreguntas(items);
            }

        }
        getData();
    }, [])

    const renderList = (data) => {
        return (
            <ul>
                {data.map((item, index) => (
                    <Ticket key={index} ticket={item} />
                ))}
            </ul>
        );
    };

    return (
        <div className='workspace'>
            <Navbar />
            <div className="grid">
                <aside className='list-container'>
                    <FilterableList data={data} field={'name'} renderList={renderList} />
                </aside>
                <section className='list-container'>
                    <FilterableList data={preguntas} field={'question'} renderList={renderList} />
                </section>
            </div>

        </div>
    )
}
export default TicketsPage;