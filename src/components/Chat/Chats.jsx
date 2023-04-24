import React, { useContext, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import cassandra from '../../img/redhead.png';

const Chats = () => {
    const [chats, setChats] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                //console.log("Current data: ", doc.data());
                setChats(doc.data());
            });

            return () => {
                unsub();
            }
        };

        currentUser.uid && getChats();
    }, [currentUser.uid]);


    const handleSelect = (user) => {
        dispatch({ type: "CHANGE_USER", payload: user })
    }

    return (
        <div className="chats">
            <div className="user-chat" key={0} onClick={() => handleSelect({displayName: "Cassandra", photoURL: 'https://firebasestorage.googleapis.com/v0/b/casssandra-bot.appspot.com/o/images%2Fredhead.png?alt=media&token=56d6f00a-0f53-41c4-b25b-0d0390426f69', uuid: "bot"})}>
                <img src={cassandra} alt="" />
                <div className="user-chat-info">
                    <span>{'Cassandra'}</span>
                    <p>{'Asistente Virtual'}</p>
                </div>
            </div>
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date)
                .map((chat) => {
                    return (
                        <div className="user-chat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
                            <img src={chat[1].userInfo.photoURL} alt="" />
                            <div className="user-chat-info">
                                <span>{chat[1].userInfo.displayName}</span>
                                <p>{chat[1].lastMessage.text}</p>
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}

export default Chats;