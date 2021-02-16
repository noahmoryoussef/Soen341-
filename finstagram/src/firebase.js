import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBPWbTO4z9Ui63beUyLqoSHZg_b_8Vz4UU",
  authDomain: "finstagram-685c3.firebaseapp.com",
  databaseURL: "https://finstagram-685c3-default-rtdb.firebaseio.com",
  projectId: "finstagram-685c3",
  storageBucket: "finstagram-685c3.appspot.com",
  messagingSenderId: "47279487522",
  appId: "1:47279487522:web:fd9eeb5db56246f95c287b",
  measurementId: "G-CJ98QHNK6C"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
