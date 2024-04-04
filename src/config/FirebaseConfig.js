import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAvlCj4j2QroVkrPH-VLsgCju1EvT8YbAQ",
  authDomain: "auth-zaloreactjs.firebaseapp.com",
  projectId: "auth-zaloreactjs",
  storageBucket: "auth-zaloreactjs.appspot.com",
  messagingSenderId: "972347611845",
  appId: "1:972347611845:web:c06c1a68d6716c7b9daeac",
  measurementId: "G-F7GQD72CDE",
  //-----------------------------------------
  // apiKey: "AIzaSyCxp0eHJNEuBYXIzna0heQjBMI8ohrOQM8",
  // authDomain: "zalo-af621.firebaseapp.com",
  // projectId: "zalo-af621",
  // storageBucket: "zalo-af621.appspot.com",
  // messagingSenderId: "352863281979",
  // appId: "1:352863281979:web:e98de251fae0fbe06b4d1e",
  // measurementId: "G-V98FRBRJLL",
  //-----------------------------------------
  // apiKey: "AIzaSyAmEbIBGFvTPjEv67tQ_jVtIOtF4sJHRpY",
  // authDomain: "auth-zalo.firebaseapp.com",
  // projectId: "auth-zalo",
  // storageBucket: "auth-zalo.appspot.com",
  // messagingSenderId: "478619326138",
  // appId: "1:478619326138:web:7f4ea6df62e1a787ccd483",
  // measurementId: "G-LQKFKLPHD6",
  //-----------------------------------------
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
