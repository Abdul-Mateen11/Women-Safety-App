import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyAh5SN1VNxg2ADBw82TI-Z-s8IXJi02Quc",
  authDomain: "women-safety-app-83584.firebaseapp.com",
  projectId: "women-safety-app-83584",
  storageBucket: "women-safety-app-83584.appspot.com",
  messagingSenderId: "799521159347",
  appId: "1:799521159347:web:f3cbb92f2ef0b0ce2b98c6",
  measurementId: "G-5D19WC1N5B"
}

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();
export { firebase, db , auth};