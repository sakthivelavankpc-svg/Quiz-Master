// 1. IMPORT FIREBASE MODULES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
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

// 4. HELPERS
const $ = (id) => document.getElementById(id);

// 5. RENDER LIBRARY
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

// 6. CLOUD FETCHING
async function loadLibraryFromCloud() {
    const libCount = $("libCount");
    if (!libCount) return;
    
    try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const quizzes = [];
        querySnapshot.forEach((doc) => {
            quizzes.push({ id: doc.id, ...doc.data() });
        });
        
        libCount.textContent = `${quizzes.length} Quizzes Loaded`;
        renderLibrary(quizzes);
    } catch (error) {
        console.error("Database Error:", error);
        libCount.textContent = "Error loading";
    }
}

// 7. EXPOSE FUNCTIONS TO WINDOW (Fixes 'not defined' error)
window.startQuiz = function(quizId) {
    console.log("Starting quiz:", quizId);
    // Add your quiz start logic here
};

window.addEventListener('load', async () => {
    await loadLibraryFromCloud();
});