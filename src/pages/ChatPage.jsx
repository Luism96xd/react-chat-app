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
    const [model, setModel] = useState('ChatSonic');
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


    const data = [{ 'name': 'ChatSonic' }, { 'name': 'Bloom' }, { 'name': 'Falcon' }, { 'name': 'A21Labs' }];

    const handleOnModelChange = (e) => {
        setModel(e.target.value);
    }

    const renderList = (data) => {
        return (
            <select className='input' onChange={handleOnModelChange}>
                {data.map((item, index) => (
                    <option key={index} value={item.name}>
                        <p>{item.name}</p>
                    </option>
                ))}
            </select>
        );
    };

    return (
        <div className='workspace'>
            <Navbar />
            <div className="grid">
                <aside className='list-container'>
                    <FilterableList data={data} field={'name'} renderList={renderList} />
                    {model}
                </aside>
                <Chatbox data={chats} model={model} />
            </div>
        </div>
    )
}
export default ChatPage;