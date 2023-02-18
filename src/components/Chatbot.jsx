import React, { useState } from 'react';
import ChatBubble from "../img/chat_bubble_filled.svg";
import Send from "../img/send.svg";

const Chatbot = () => {
    const [chat, setChat] = useState(false);
    const [text, setText] = useState("");

    const handleSend = () =>{
        console.log(chat);
    }

    return (
        <div className='chatbot'>
            {
            chat &&
                <div className='chatbot-wrapper'>
                    <div className='chatbot-header'>
                        <h3>Cassandra</h3>
                        <div>
                            <button onClick={() => setChat(!chat)}>-</button>
                        </div>
                    </div>
                    <div className='chatbot-chat'>
                        <span>{text}</span>
                    </div>
                    <div className='chatbot-input'>
                        <input type="text" 
                            placeholder='Haz una pregunta...'
                            onChange={(e) => setText(e.target.value)}
                        />
                        <button onClick={handleSend}>
                            <img src={Send} alt="Send message" />
                        </button>
                    </div>
                </div>
            }
            <button onClick={() => setChat(!chat)} className='chatbot-button'>
                <img src={ChatBubble} alt="Habla con un asistente virtual"/>
            </button>
        </div>
    )
}
export default Chatbot;
