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

// 4. APP LOGIC
const $ = (id) => document.getElementById(id);

// --- FIX: Robust Answer Comparison ---
function isCorrect(userAnswer, correctAnswer) {
    if (!userAnswer || !correctAnswer) return false;
    return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

// ... (After your initial variables and initialization like 'const db = ...')

// 1. PLACE THE NEW HELPER FUNCTION HERE:
function renderLibrary(quizzes) {
    const grid = $("libraryGrid");
    if (!grid) return; // Prevents error if grid ID doesn't exist
    grid.innerHTML = ""; 
    
    if (quizzes.length === 0) {
        grid.innerHTML = "<p>No quizzes found in the cloud.</p>";
        return;
    }

    quizzes.forEach(q => {
        const card = document.createElement("div");
        card.className = "quiz-card";
        card.innerHTML = `
            <span class="card-badge" style="background:var(--primary)">${q.subject || 'General'}</span>
            <h4 class="card-title">${q.examName || 'Untitled Quiz'}</h4>
            <div class="card-sub">${q.topic || 'No topic specified'} | ${q.classGrade || 'N/A'}</div>
            <button class="btn-primary" onclick="startQuiz('${q.id}')">Play</button>
        `;
        grid.appendChild(card);
    });
}

// 2. THEN, UPDATE YOUR EXISTING FUNCTION HERE:
async function loadLibraryFromCloud() {
    const libCount = $("libCount");
    if (!libCount) return;
    libCount.textContent = "Loading...";
    
    try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const quizzes = [];
        querySnapshot.forEach((doc) => {
            quizzes.push({ id: doc.id, ...doc.data() });
        });
        
        libCount.textContent = `${quizzes.length} Quizzes Loaded`;
        renderLibrary(quizzes); // <--- Add this call here
    } catch (error) {
        console.error("Database Error:", error);
        libCount.textContent = "Error loading";
    }
}

window.addEventListener('load', async () => {
    await loadLibraryFromCloud();
});

// NOTE: When processing CSV/Manual rows, ensure your mapping looks like this:
// question: row[0],
// options: [row[1], row[2], row[3], row[4]],
// correct: row[5] // The column containing the exact match text