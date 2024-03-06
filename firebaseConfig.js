import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Import initializeAuth
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; // Import ReactNativeAsyncStorage
import { getStorage } from 'firebase/storage'; // Remove unnecessary imports
import { getFirestore } from 'firebase/firestore'; // Import getFirestore
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQBBdZGsjI43h2GoNR49R86QoWHe3wMRg",
  authDomain: "readymeals-97c8e.firebaseapp.com",
  databaseURL: "https://readymeals-97c8e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "readymeals-97c8e",
  storageBucket: "readymeals-97c8e.appspot.com",
  messagingSenderId: "697541408653",
  appId: "1:697541408653:web:71e3d9887c06d666292fc4",
  measurementId: "G-BHGEKM8M8J"
};
// Starts Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firestore
const firestore = getFirestore(app); // Get Firestore insta

const imgDB = getStorage(app)
const txtDB = getFirestore(app)

export {};
// Export authentication, storage, and Firestore libraries
export { auth, storage, firestore ,imgDB,txtDB }; 