importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyBPq47m4icGB0rO7qbb6gW8YY1vC5_q1fA",
    authDomain: "casssandra-bot.firebaseapp.com",
    projectId: "casssandra-bot",
    storageBucket: "casssandra-bot.appspot.com",
    messagingSenderId: "727531493781",
    appId: "1:727531493781:web:457796ec8036bf2b4abe9c",
    measurementId: "G-ZEYYP796Z7"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});