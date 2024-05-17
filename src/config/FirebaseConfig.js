import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export const firebaseConfig = {
  // apiKey: "AIzaSyAmEbIBGFvTPjEv67tQ_jVtIOtF4sJHRpY",
  // authDomain: "auth-zalo.firebaseapp.com",
  // projectId: "auth-zalo",
  // storageBucket: "auth-zalo.appspot.com",
  // messagingSenderId: "478619326138",
  // appId: "1:478619326138:web:7f4ea6df62e1a787ccd483",
  // measurementId: "G-LQKFKLPHD6",
  apiKey: "AIzaSyAmEbIBGFvTPjEv67tQ_jVtIOtF4sJHRpY",
  authDomain: "auth-zalo.firebaseapp.com",
  projectId: "auth-zalo",
  storageBucket: "auth-zalo.appspot.com",
  messagingSenderId: "478619326138",
  appId: "1:478619326138:web:cb6291fb58efe601ccd483",
  measurementId: "G-P9X3J52LBD",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
