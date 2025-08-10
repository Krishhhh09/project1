import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIaEhEH5bJNaqY92TRZ6RTc29EDaJx4LA",
  authDomain: "voting-app-3a0d0.firebaseapp.com",
  projectId: "voting-app-3a0d0",
  storageBucket: "voting-app-3a0d0.appspot.com",
  messagingSenderId: "SENDER",
  appId: "1:919899924480:web:c1b4c71a88e940714dd0e5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Restrict access to admins only
if (localStorage.getItem("adminLoggedIn") !== "true") {
  alert("Access denied. Please log in as admin.");
  window.location.href = "admin.html";
}

const resultsContainer = document.getElementById("results-container");

async function loadResults() {
  try {
    // Fetch all sections
    const sectionsSnapshot = await getDocs(collection(db, "sections"));

    // For each section
    for (const sectionDoc of sectionsSnapshot.docs) {
      const sectionData = sectionDoc.data();

      // Section heading
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "section";
      const sectionHeading = document.createElement("h2");
      sectionHeading.textContent = sectionData.name || sectionDoc.id;
      sectionDiv.appendChild(sectionHeading);

      // Fetch nominees subcollection sorted by votes desc
      const nomineesRef = collection(db, "sections", sectionDoc.id, "nominees");
      const nomineesQuery = query(nomineesRef, orderBy("votes", "desc"));
      const nomineesSnapshot = await getDocs(nomineesQuery);

      if (nomineesSnapshot.empty) {
        const noNominees = document.createElement("p");
        noNominees.textContent = "No nominees found.";
        sectionDiv.appendChild(noNominees);
      } else {
        const ul = document.createElement("ul");
        for (const nomineeDoc of nomineesSnapshot.docs) {
          const nominee = nomineeDoc.data();
          const li = document.createElement("li");
          li.textContent = `${nominee.name} — ${nominee.votes} votes`;
          ul.appendChild(li);
        }
        sectionDiv.appendChild(ul);
      }
      resultsContainer.appendChild(sectionDiv);
    }
  } catch (error) {
    console.error("Error loading results:", error);
    resultsContainer.textContent = "Failed to load results.";
  }
}

loadResults();