import { onSnapshot, doc } from 'firebase/firestore';
import React, { useContext, useState, useEffect } from 'react'
import { ChatContext } from '../context/ChatContext';
import Message from './Message';
import { db } from '../firebase';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const {data} = useContext(ChatContext);
 
  useEffect(() => {
    console.log(data);
    if (data.chatId !== ''){
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) =>{
        if (doc.exists()){
          setMessages(doc.data().messages);
        }
      });
    
      return () => {
        unSub();
      }
    }
  }, [data.chatId])

  console.log(messages);
  
  return (
    <div className='messages'>
        {messages.map( message => {
          return (
            <Message message={message} key={message.id}/>
          )
        })}
    </div>
  )
}
export default Messages;