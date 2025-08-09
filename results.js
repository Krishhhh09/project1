import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIaEhEH5bJNaqY92TRZ6RTc29EDaJx4LA",
  authDomain: "voting-app-3a0d0.firebaseapp.com",
  projectId: "voting-app-3a0d0",
  storageBucket: "voting-app-3a0d0.firebasestorage.app",
  messagingSenderId: "SENDER",
  appId: "1:919899924480:web:c1b4c71a88e940714dd0e5"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get the "results" div
const resultsDiv = document.getElementById("results");

// Load and display results from Firestore
async function loadResults() {
  try {
    const voteSections = await getDocs(collection(db, "votes"));

    voteSections.forEach(docSnap => {
      const sectionId = docSnap.id;
      const data = docSnap.data();

      // Create a container for each section
      const sectionContainer = document.createElement("div");
      sectionContainer.classList.add("result-section");

      // Add section title
      const sectionTitle = document.createElement("h3");
      sectionTitle.textContent = `Section: ${sectionId}`;
      sectionContainer.appendChild(sectionTitle);

      // List each candidate with their vote count
      for (const [candidate, votes] of Object.entries(data)) {
        const candidateResult = document.createElement("p");
        candidateResult.textContent = `${candidate}: ${votes} vote${votes !== 1 ? 's' : ''}`;
        candidateResult.classList.add("candidate-result");
        sectionContainer.appendChild(candidateResult);
      }

      // Add the section to the main result container
      resultsDiv.appendChild(sectionContainer);
    });
  } catch (error) {
    console.error("Error loading results:", error);
    resultsDiv.innerHTML = `<p class="error">Failed to load results. Please try again later.</p>`;
  }
}

loadResults();
