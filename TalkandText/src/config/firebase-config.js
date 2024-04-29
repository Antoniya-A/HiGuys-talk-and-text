import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCL7KFVsZgTksUVfXJshIyQLBBtfm86Rts",
  authDomain: "talk-and-text-app.firebaseapp.com",
  projectId: "talk-and-text-app",
  storageBucket: "talk-and-text-app.appspot.com",
  messagingSenderId: "15861181337",
  appId: "1:15861181337:web:d065632a2055873d9d8108",
  databaseURL: "https://talk-and-text-app-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
