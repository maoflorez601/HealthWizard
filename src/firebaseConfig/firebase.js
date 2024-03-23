// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"; //import for firestore DB
import { getAuth } from "firebase/auth"; //import for firestone authentication

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0iLq7PWH5djz2RDVZXJB-wN16iRDof8Q",
  authDomain: "health-wizard-web.firebaseapp.com",
  projectId: "health-wizard-web",
  storageBucket: "health-wizard-web.appspot.com",
  messagingSenderId: "499704478031",
  appId: "1:499704478031:web:1e38020d9d85318706ed3a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// create const for db
const db = getFirestore(app);

//create const for Authentication
const auth = getAuth(app);

export {app, db, auth} //export firebase elements

