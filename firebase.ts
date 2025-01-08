import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAfBbUMag32496cxMbjProiJ5lMIbGRmkw",
    authDomain: "pywhiz-32616.firebaseapp.com",
    projectId: "pywhiz-32616",
    storageBucket: "pywhiz-32616.firebasestorage.app",
    messagingSenderId: "352400655252",
    appId: "1:352400655252:web:2dbf716d0462fbe4bd0581",
    measurementId: "G-HYCRM5F37W"
  };

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firebase Authentication instance
export const auth = getAuth(app);
