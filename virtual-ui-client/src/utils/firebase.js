
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
   authDomain: "interview-2ad0b.firebaseapp.com",
  projectId: "interview-2ad0b",
  storageBucket: "interview-2ad0b.firebasestorage.app",
  messagingSenderId: "598345122668",
  appId: "1:598345122668:web:bd0fdd43c507ab9db12949"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}