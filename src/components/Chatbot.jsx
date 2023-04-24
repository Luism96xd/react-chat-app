import React, { useState } from 'react';
import ChatBubble from "../img/chat_bubble_filled.svg";
import Send from "../img/send.svg";
import axios from 'axios';
import '../scss/components/_chatbot.scss';

const Chatbot = () => {
    const [chat, setChat] = useState(false);
    const [text, setText] = useState("");
    const [audio, setAudio] = useState(null);

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const handleSend = async () =>{
        const response = await axios.post(BASE_URL+'/api/predict', {text: text});
        setAudio(response.audio);
        console.log(response);
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
                        <span className="audio-icon">
                            <audio id="audio" src={audio} controls></audio>
                        </span>
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
