import { initializeApp }  from "firebase/app";
import {getDatabase, ref, set } from "firebase/database";

const config = {
  apiKey: "AIzaSyBd7z644_giN5TX9lv5T1AdHfp1ilwsrbA",
  authDomain: "revercial-43fe3.firebaseapp.com",
  databaseURL: "https://revercial-43fe3-default-rtdb.firebaseio.com/",
  projectId: "revercial-43fe3",
  storageBucket: "revercial-43fe3.appspot.com",
  messagingSenderId: "277923181143",
  appId: "1:277923181143:web:17230c5cdb451126146912",
  measurementId: "G-4VYLQMSHKR",
};

const fbConfig = initializeApp(config);
  
  export function saveUserData(newUser) {
    const db =  getDatabase();
    const sanitizedEmail = newUser.email.replace(".",",");
    const reference = ref(db, 'Users/' + sanitizedEmail);

    set(reference, {
        Name: newUser.first_name,
        Surname: newUser.surname,
        DOB: newUser.date_of_birth,
        Username: newUser.username,
        Password: newUser.password
    });
  }
