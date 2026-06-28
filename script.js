// 1. IMPORT FIREBASE MODULES (Only one set of these!)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";

// 2. CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyAnxIsftWdUxtHEh7nxX1UPRA29c0n1444",
  authDomain: "quiz-master-3e489.firebaseapp.com",
  projectId: "quiz-master-3e489",
  storageBucket: "quiz-master-3e489.firebasestorage.app",
  messagingSenderId: "741393992507",
  appId: "1:741393992507:web:b28cd8fcda2b74f85b851e",
  measurementId: "G-K3W2FKZRN9"
};

// 3. INITIALIZATION
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const $ = (id) => document.getElementById(id);

// 4. DEFINE FUNCTION BEFORE ATTACHING
function startQuiz(quizId) {
    console.log("Starting quiz:", quizId);
    // Add your quiz logic here
}

// 5. ATTACH TO WINDOW
window.startQuiz = startQuiz;

// 6. RENDER & LOAD
function renderLibrary(quizzes) {
    const grid = $("libraryGrid");
    if (!grid) return;
    grid.innerHTML = ""; 
    quizzes.forEach(q => {
        const card = document.createElement("div");
        card.className = "quiz-card";
        card.innerHTML = `
            <h4>${q.examName || 'Untitled Quiz'}</h4>
            <button class="btn-primary" onclick="window.startQuiz('${q.id}')">Play</button>
        `;
        grid.appendChild(card);
    });
}

async function loadLibraryFromCloud() {
    try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const quizzes = [];
        querySnapshot.forEach((doc) => { quizzes.push({ id: doc.id, ...doc.data() }); });
        renderLibrary(quizzes);
    } catch (error) {
        console.error("Database Error:", error);
    }
}

window.addEventListener('DOMContentLoaded', loadLibraryFromCloud);