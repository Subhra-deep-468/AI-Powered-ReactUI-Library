
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "virtualdemo-707f4.firebaseapp.com",
  projectId: "virtualdemo-707f4",
  storageBucket: "virtualdemo-707f4.firebasestorage.app",
  messagingSenderId: "850646440578",
  appId: "1:850646440578:web:77dbf5a3d5618c2c14729b"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}