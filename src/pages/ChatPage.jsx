import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import FilterableList from '../components/FilterableList';
import Chatbox from "../components/Chatbox";
import '../scss/pages/tickets.scss';
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from '../context/AuthContext';
import '../scss/components/_chat.scss';

const ChatPage = () => {
    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const getChats = () => {
            setLoading(true);
            console.log(currentUser.uid)
            const unsub = onSnapshot(doc(db, "mensajes", currentUser.uid), (doc) => {
                setChats(doc.data().messages);
            });
            setLoading(false);
            return () => {
                unsub();
            }
        };

        currentUser.uid && getChats();
    }, [currentUser.uid]);


    const data = [{'name': 'Luis'}, {'name': 'Jane'}, {'name': 'John'}]
   
    const renderList = (data) => {
        return (
            <ul>
                {data.map((item, index) => (
                    <div key={index}>
                        <p>{item.name}</p>
                    </div>
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
                <Chatbox data={chats} />
            </div>
        </div>
    )
}
export default ChatPage;