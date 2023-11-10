// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBSloMAeT8fXNh0LdOJuE-I40ME8jcj5-A",
  authDomain: "tictactoe-5a2d4.firebaseapp.com",
  projectId: "tictactoe-5a2d4",
  storageBucket: "tictactoe-5a2d4.appspot.com",
  messagingSenderId: "45279044172",
  appId: "1:45279044172:web:bd03dcad536204f24a4ae9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);

