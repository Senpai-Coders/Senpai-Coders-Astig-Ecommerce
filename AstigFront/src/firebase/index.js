import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2k54pUVTZYbEzf3NM5CAHc_4pZtB76lA",
  authDomain: "astig-ecomerce.firebaseapp.com",
  projectId: "astig-ecomerce",
  storageBucket: "astig-ecomerce.appspot.com",
  messagingSenderId: "509945408338",
  appId: "1:509945408338:web:d55632d1ea7e5b5838288b",
  measurementId: "G-43LYWKBLM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app);

export {storage}