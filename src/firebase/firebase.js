import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHulJa9fPwlqWpNGvjPVdu385ey-4W99E",
  authDomain: "partypeople-66b7a.firebaseapp.com",
  databaseURL: "https://partypeople-66b7a.firebaseio.com",
  projectId: "partypeople-66b7a",
  storageBucket: "partypeople-66b7a.appspot.com",
  messagingSenderId: "561711905554",
  appId: "1:561711905554:web:0ca082bf9f36275c2211cb",
  measurementId: "G-KBZ5PF6QY6"
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const database = firebase.firestore();

export {
    storage, database, firebase as default
}
