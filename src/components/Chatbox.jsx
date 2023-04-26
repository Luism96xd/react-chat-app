import React, { useContext, useState } from 'react';
import Send from "../img/send.svg";
import { uuidv4 } from '@firebase/util';
import axios from 'axios';
import { db } from "../firebase";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { AuthContext } from '../context/AuthContext';

const Chatbox = ({ data }) => {
    const [text, setText] = useState("");
    const { currentUser } = useContext(AuthContext);

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const handleSend = async () => {
        if (text !== null || text !== undefined) {
            const response = await axios.post(BASE_URL + '/api/predict', { text: text });
            console.log(response.data);
            const audio = new Uint8Array(response.data.audio.data);

            const userData = {
                messages: arrayUnion({
                    id: uuidv4(),
                    text: text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                })
            }

            const botData = {
                messages: arrayUnion({
                    id: uuidv4(),
                    text: response.data.text,
                    senderId: 'bot',
                    date: Timestamp.now(),
                })
            }

            // Check whether the document exists
            const docRef = doc(db, "mensajes", currentUser.uid);
            const docSnap = await getDoc(docRef);

            // If the document doesn't exist yet, save the data using setDoc
            if (!docSnap.exists()) {
                await setDoc(docRef, userData);
                await setDoc(docRef, botData);
            }else{
                await updateDoc(docRef, userData);
                await updateDoc(docRef, userData);
            }
            playOutput(audio)
        }
        setText("");
    }

    const handleKey = (e) => {
        if (e.code === "Enter") {
            console.log("enter");
            handleSend();
        };
    }

    const playOutput = (audioBuffer) => {
        let audioContext = new AudioContext();
        let outputSource;
        const arrayBuffer = audioBuffer.buffer;
        //console.log(arrayBuffer);
        //console.log(arrayBuffer.byteLength);
        //console.log(typeof (arrayBuffer))
        try {
            if (arrayBuffer.byteLength > 0) {
                audioContext.decodeAudioData(arrayBuffer,
                    function (buffer) {
                        audioContext.resume();
                        outputSource = audioContext.createBufferSource();
                        outputSource.buffer = buffer;
                        outputSource.connect(audioContext.destination);
                        outputSource.start(0);
                    },
                    function () {
                        console.log(arguments);
                    });
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="chatbox">
            <div className="chatlogs">
                <div className="msg bot">¡Hola! Soy Cassandra, tu asistente virtual. ¿En qué te puedo ayudar?</div>
                {data?.map((item, index) => (
                    <div
                        className={`msg ${(item.senderId == 'bot') ? 'bot' : 'me'}`}
                        key={index}
                    >
                        <p>{item.text}</p>
                    </div>
                ))}
            </div>
            <div className="chatinput">
                <input
                    type="text"
                    value={text}
                    placeholder="Escribe un mensaje..."
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKey}
                />
                <button className="send" onClick={handleSend}>
                    <img src={Send} className='icon' alt="Send message" />
                </button>
            </div>
        </div>
    )
}

export default Chatbox;