import { initializeApp }  from "firebase/app";

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

export const fbConfig = initializeApp(config);
