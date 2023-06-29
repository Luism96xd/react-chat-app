import React, { useContext, useRef, useState } from 'react';
import { uuidv4 } from '@firebase/util';
import axios from 'axios';
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { AuthContext } from '../context/AuthContext';

const Chatbox = ({ data }) => {
    const [text, setText] = useState("");
    const { currentUser } = useContext(AuthContext);
    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const mediaRecorder = useRef(null);


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
                await updateDoc(docRef, botData);
            } else {
                await updateDoc(docRef, userData);
                await updateDoc(docRef, botData);
            }
            playOutput(audio)
        }
        setText("");
    }

    const recognizeSpeech = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log("getUserMedia is not supported.");
            return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const media = new MediaRecorder(stream);
        mediaRecorder.current = media;
        console.log("isRecording: ", isRecording);

        if (!isRecording) {
            mediaRecorder.current.start()
            console.log(mediaRecorder.state);
            mediaRecorder.current.ondataavailable = handleDataAvailable;
            setIsRecording(true);
        } else {
            mediaRecorder.current.stop();
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
            console.log(audioChunks);
            setIsRecording(false);
            mediaRecorder.current.onstop = handleAudioStop;

            if (mediaRecorder.state === 'inactive') {
                const audioInput = new Blob(audioChunks, { type: "audio/ogg; codecs=opus" });
                console.log(audioInput)
                //const audioInput64 = convertToBase64AndSend(audioInput);
                console.log("audio: ")
                const audioInput64 = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(audioInput))));
                console.log(audioInput64);

                const response = await axios.post(BASE_URL + '/api/speech', { audioInput: audioInput64 })
                console.log(response.data);
                setAudioChunks([]);
            }
        }
    }
    const handleDataAvailable = (e) => {
        console.log("handleDataAvailable");
        if (e.data.size > 0) {
            setAudioChunks((prev) => [...prev, e.data]);
        }
    }
    const handleAudioStop = (e) => {
        console.log("handleAudioStop");
        if (audioChunks) {
            if (audioChunks.length > 0) {
                const audio = document.createElement('audio');
                audio.controls = true;
                const blob = new Blob(audioChunks, { 'type': 'audio/ogg; codecs=opus' });
                const audioURL = window.URL.createObjectURL(blob);
                audio.src = audioURL;
                audio.play();
            }
        }
    }

    const convertToBase64AndSend = (audioBlob) => {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
            const base64data = reader.result;
            return base64data;
        }
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
                        //audioContext.resume();
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
                        className={`msg ${(item.senderId === 'bot') ? 'bot' : 'me'}`}
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
                <button className={`mic rounded-btn ${isRecording ? 'recording' : ""}`} onClick={recognizeSpeech}>
                    <svg xmlns="http://www.w3.org/2000/svg" aria-label="Record audio input" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${isRecording ? 'hidden' : ""}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                </button>
                <button className="send rounded-btn" onClick={handleSend}>
                    <svg xmlns="http://www.w3.org/2000/svg" aria-label='Send Message' fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Chatbox;