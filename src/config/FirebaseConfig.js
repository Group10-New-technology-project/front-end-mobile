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
  apiKey: "AIzaSyCcpX6viZaSeJL1OmcvwCK3K5UsJg4xwLc",
  authDomain: "demo2-1c4df.firebaseapp.com",
  projectId: "demo2-1c4df",
  storageBucket: "demo2-1c4df.appspot.com",
  messagingSenderId: "663779840228",
  appId: "1:663779840228:web:43d9fa60f56a099cdb5cf1",
  measurementId: "G-318L8TVSTQ",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
