// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import { ActionCodeSettings, getAuth, sendSignInLinkToEmail } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTq3npEMqsPLGcPlsAWnu5kWsyrX4-gQE",
  authDomain: "gpt-jam-auth.firebaseapp.com",
  projectId: "gpt-jam-auth",
  storageBucket: "gpt-jam-auth.appspot.com",
  messagingSenderId: "448024618747",
  appId: "1:448024618747:web:cb98902b2e6c5d01ac325e",
  measurementId: "G-N6BW86EXZ4"
};

const actionCodeSettings: ActionCodeSettings = {
    url: 'http://localhost:5173/doctor-lookup',
    handleCodeInApp: true,
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = getAuth(app);
const authenticateWithEmail = async (email: string) => {
    try {
        const response = await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
    }
}

export { auth, authenticateWithEmail, firebaseConfig };
