// firebase.js or firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDOSyMlZmUhJo27UoRvaSWFqyBgYJmjJJs',
  authDomain: 'irune-57f92.firebaseapp.com',
  projectId: 'irune-57f92',
  storageBucket: 'irune-57f92.firebasestorage.app',
  messagingSenderId: '67600694131',
  appId: '1:67600694131:web:efa8376dd6356374c32306',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
