import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAy1aiGautziAM0wB2pHhl7weNb8wIqYqg",
    authDomain: "calendar-appx.firebaseapp.com",
    projectId: "calendar-appx",
    storageBucket: "calendar-appx.appspot.com",
    messagingSenderId: "1068568363553",
    appId: "1:1068568363553:web:089c54c390f21b005ad960"
  };
  
  export const app = initializeApp(firebaseConfig)
  export const fireStore=getFirestore(app)
  
