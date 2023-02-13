//import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
/*
import serviceAccount from "./casssandra-bot-firebase.json";
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
*/

const firebaseConfig = {
    apiKey: "AIzaSyBPq47m4icGB0rO7qbb6gW8YY1vC5_q1fA",
    authDomain: "casssandra-bot.firebaseapp.com",
    projectId: "casssandra-bot",
    storageBucket: "casssandra-bot.appspot.com",
    messagingSenderId: "727531493781",
    appId: "1:727531493781:web:457796ec8036bf2b4abe9c",
    measurementId: "G-ZEYYP796Z7"
  };

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);