import React, { useContext, useRef, useState } from 'react';
import { uuidv4 } from '@firebase/util';
import axios from 'axios';
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { AuthContext } from '../context/AuthContext';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';

const Chatbox = ({ data, model }) => {
    const [text, setText] = useState("");
    const [includeAudio, setIncludeAudio] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const bottomEl = useRef(null);
    const [blob, setBlob] = useState();

    const scrollToBottom = () => {
        bottomEl?.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const handleSend = async () => {
        if (text !== null || text !== undefined) {
            const request = {
                text: text
            }
            if (includeAudio) {
                request.includeAudio = includeAudio;
            }
            const response = await axios.post(BASE_URL + '/api/predict', {
                request: request,
                uid: currentUser.uid,
                model: model
            });
            handleSaveMessage(text, response.data.text);
            if (includeAudio) {
                playOutput(response.data.audio);
            }
        }
        setText("");
    }
    const recognizeSpeech = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log("getUserMedia is not supported.");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            const recorder = RecordRTC(stream, {
                type: 'audio',
                mimeType: 'audio/webm',
                sampleRate: 44100, // this sampleRate should be the same in your server code
                recorderType: StereoAudioRecorder,
                // Dialogflow / STT requires mono audio
                numberOfAudioChannels: 1,
                timeSlice: 1000,
                // let us force 16khz recording:
                desiredSampRate: 16000,

            });
            if (recorder === undefined) {
                return;
            }
            await recorder.startRecording();
            setIsRecording(true);

            setTimeout(async () => {
                await recorder.stopRecording(async () => {
                    setBlob(null);
                    const audioBlob = await recorder.getBlob();
                    setBlob(audioBlob);
                    await recorder.reset();
                    console.log(audioBlob)
                    if (audioBlob !== undefined) {
                        handleSaveAudio(audioBlob);
                    }
                });
                setIsRecording(false);
            }, 4000);
        } catch (error) {
            console.log("getUserMedia error:", error);
            return;
        }
    }
    const convertToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(",")[1];
                resolve(base64);
            };
            reader.onerror = () => {
                reject(reader.error);
            };
            reader.readAsDataURL(blob);
        });
    }
    const handleSaveAudio = async (blob) => {
        const audioBase64 = await convertToBase64(blob);
        const request = {
            audioInput: audioBase64,
        }
        if (includeAudio) {
            request.includeAudio = includeAudio;
        }
        const response = await axios.post(BASE_URL + '/api/speech', { 
            request: request,
            uid: currentUser.uid,
            model: model,
        });
        console.log(response.data)
        handleSaveMessage(response?.data?.query, response?.data?.text);
        if (includeAudio) {
            playOutput(response.data.audio);
        }
        setAudioChunks(null);
    };
    const handleKey = (e) => {
        if (e.code === "Enter") {
            console.log("enter");
            handleSend();
        };
    }
    const handleSaveMessage = async (userMessage, botMessage) => {
        const userData = {
            messages: arrayUnion({
                id: uuidv4(),
                text: userMessage,
                senderId: currentUser.uid,
                date: Timestamp.now(),
            })
        }

        const botData = {
            messages: arrayUnion({
                id: uuidv4(),
                text: botMessage,
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
        scrollToBottom();
    }
    const playOutput = (audioBuffer) => {
        const audio = new Uint8Array(audioBuffer.data);
        let audioContext = new AudioContext();
        let outputSource;
        const arrayBuffer = audio.buffer;
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
                <div ref={bottomEl}></div>
            </div>
            <div className="chatinput">
                <button className='rounded-btn text-gray' onClick={() => setIncludeAudio(!includeAudio)}>
                    {
                        (includeAudio) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                            </svg>
                        )
                    }
                </button>
                <input
                    type="text"
                    value={text}
                    placeholder="Escribe un mensaje..."
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKey}
                />
                <button className={`rounded-btn text-gray ${isRecording ? 'recording' : ""}`} onClick={recognizeSpeech}>
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