import { doc, updateDoc } from "firebase/firestore";
import { getToken } from "firebase/messaging";
import { messaging, db } from "./firebase";

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const getFCMToken = async (currentUser) => {
    try {
        const currentToken = await getToken(messaging, { vapidKey: 'BI4sDNUetqkl6nP119HJq02yX98m1YAGRtSs1c6Kn3wGrLUe5pTYpgimxgO4p5PSKNdwg33L3LL2LqlZnwdtOrM' });
        if (currentToken) {
            // Send the token to your server and update the UI if necessary
            await updateDoc(doc(db, "users", currentUser.uid), {
              permissionGranted: true,
              FCMToken: currentToken
            });
        } else {
            console.log('No registration token available. Request permission to generate one.');
        }
    } catch (error) {
        console.log('An error occurred while retrieving token. ', error);
    }
}
export const requestPermission = async (currentUser) => {
    console.log('Requesting permission...');
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        console.log('Notification permission granted.');
        getFCMToken(currentUser);
    }
}