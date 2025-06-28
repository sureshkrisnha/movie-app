// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// REPLACE WITH YOUR ACTUAL FIREBASE CONFIGURATION FROM STEP 1
const firebaseConfig = {  
apiKey: "AIzaSyCX1fMaDW07Al37OxppRBz1E-VVgd7Sf7s",
authDomain: "movie-app-auth-c5923.firebaseapp.com",
projectId: "movie-app-auth-c5923",
storageBucket: "movie-app-auth-c5923.firebasestorage.app",
messagingSenderId: "940287881649",
appId: "1:940287881649:web:416fce5aaafd1ad817cd90"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);

export { auth };
