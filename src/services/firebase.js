import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyD8-IYr166TPAtJ6CMgYe6cOxSomRSzIIQ",
  authDomain: "collections-ee444.firebaseapp.com",
  projectId: "collections-ee444",
  storageBucket: "collections-ee444.firebasestorage.app",
  messagingSenderId: "937548251239",
  appId: "1:937548251239:web:851a595df8c2670b2394c2",
  measurementId: "G-MC7LSJP8Z1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);