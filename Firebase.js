// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkaxcQrv2ajXC24Oy4V-YM4u0e_OSjM9o",
  authDomain: "itpmpro-167.firebaseapp.com",
  databaseURL:
    "https://itpmpro-167-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "itpmpro-167",
  storageBucket: "itpmpro-167.appspot.com",
  messagingSenderId: "1079304146785",
  appId: "1:1079304146785:web:64e0848878abf6d15dff20",
  measurementId: "G-J9KVFFHCRX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
