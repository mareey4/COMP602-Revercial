import { initializeApp }  from "firebase/app";
import {getDatabase} from "firebase/database";
import user from "./user";

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
const db = getDatabase(fbConfig);

export const saveUserData = async (email, first_name, surname) => {
  const sanitizedEmail = email.replace('.', ',');
  const databasePath = `Users/${sanitizedEmail}`;
  const dbRef = ref(db, databasePath);

  try{
    await set(dbRef, {first_name: first_name, surname: surname});
    console.log("User created successfully!");
  }catch(error){
    console.error("Error creating a user!", error);
    throw error;
  }
};