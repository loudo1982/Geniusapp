// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage,ref } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA4V2l4GjIO3iaY8jK8Tuo0UbALmP_Yakk",
    authDomain: "genius-91495.firebaseapp.com",
    projectId: "genius-91495",
    storageBucket: "genius-91495.appspot.com",
    messagingSenderId: "918930105588",
    appId: "1:918930105588:web:a4729c5bbc1389a4ffeaa1",
    measurementId: "G-W6WKMH0HR9"
  };
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);




