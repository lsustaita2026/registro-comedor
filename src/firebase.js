// Importar funciones de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔹 Aquí pegas tu configuración personal de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCPRraVwqw-Cbz9yHKaX2sXfm3JNT7BH0w",
  authDomain: "registro-comedor-peasa.firebaseapp.com",
  projectId: "registro-comedor-peasa",
  storageBucket: "registro-comedor-peasa.firebasestorage.app",
  messagingSenderId: "1006551444621",
  appId: "1:1006551444621:web:e975fb26ee28ccef3006c4"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
