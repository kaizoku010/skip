import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword
} from "firebase/auth";
import { 
  getFirestore,
  collection,
  orderBy,
  where,
  setDoc,
  query,
  addDoc,
  runTransaction,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  limit,
  startAfter,
  arrayUnion
} from "firebase/firestore";
import { 
  getDatabase,
  ref,
  onValue,
  child 
} from "firebase/database";
import { AppRegistry } from 'react-native';
import App from '../../_layout';
import { name as appName } from '../../../app.json';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA689XXkcCzM-Q4GTSNrHbI9e13-9XKHoA",
  authDomain: "selfcheckinapps.firebaseapp.com",
  databaseURL: "https://selfcheckinapps-default-rtdb.firebaseio.com",
  projectId: "selfcheckinapps",
  storageBucket: "selfcheckinapps.appspot.com",
  messagingSenderId: "861079724058",
  appId: "1:861079724058:web:64c69d87e9e6ef06a6f1a3"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

// Register the main application component
AppRegistry.registerComponent(appName, () => App);

export {
  auth,
  where,
  doc,
  updateDoc,
  getDoc,
  db,
  orderBy,
  runTransaction,
  query,
  addDoc,
  serverTimestamp,
  onAuthStateChanged,
  setPersistence,
  collection,
  onSnapshot,
  getDocs,
  createUserWithEmailAndPassword,
  database,
  ref,
  onValue,
  limit,
  startAfter,
  arrayUnion,
  signInWithEmailAndPassword
};
