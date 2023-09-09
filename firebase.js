import { initializeApp }  from "firebase/app";
import {getDatabase, ref, set, onValue } from "firebase/database";
import User from './user';

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
    const referenceEmail = ref(db, 'Users/' + sanitizedEmail);

    set(referenceEmail, {
        Name: newUser.first_name,
        Surname: newUser.surname,
        DOB: newUser.date_of_birth,
        Username: newUser.username,
        Password: newUser.password
    });
  }

  export function checkExistingEmail(userEmail) {
    const db = getDatabase();
    const refEmail = ref(db, 'Users');
    const sanitizedEmail = userEmail.replace(".",",");
    let exists = false;

    onValue(refEmail, (snapshot) => {
      const dataEmail = snapshot.val();

      for(const email in dataEmail){
        if(email === sanitizedEmail){
          exists = true;
          break;
        }
      }
    });

    return exists;
  }

  export function getAllUsers() {
    const db = getDatabase();
    const refUsers = ref(db, 'Users');
    const users = [];

    onValue(refUsers, (snapshot) => {
      const data = snapshot.val();

      for(const email in data){
        const userData = data[email];

        const user = new User(
          userData.Name,
          userData.Surname,
          userData.Username,
          userData.DOB,
          email,
          userData.password
        );

        users.push(user);
      }
    });

    return users;
  }
