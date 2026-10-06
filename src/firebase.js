import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCOdPWxE3SsQbNLXQKEzaZsZomndafvmgc",
  authDomain: "m9-admin.firebaseapp.com",
  databaseURL: "https://m9-admin-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "m9-admin",
  storageBucket: "m9-admin.firebasestorage.app",
  messagingSenderId: "915199873066",
  appId: "1:915199873066:web:f6a484d374f39538efb353",
  measurementId: "G-C6DSS7MP41"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);