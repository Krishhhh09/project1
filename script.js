// script.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc
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

const submitBtn = document.getElementById("submit-vote-btn");

async function submitVote() {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("User not logged in!");
    window.location.href = "login.html";
    return;
  }

  const sections = ["section1", "section2", "section3", "section4", "section5"];
  const votesToAdd = {};

  for (const section of sections) {
    const checkedBoxes = document.querySelectorAll(`input[name="${section}"]:checked`);
    if (checkedBoxes.length !== 2) {
      alert(`Please select exactly 2 candidates in ${section}.`);
      return;
    }

    votesToAdd[section] = Array(4).fill(0); // 4 candidates per section
    checkedBoxes.forEach(cb => {
      const index = parseInt(cb.value);
      votesToAdd[section][index]++;
    });
  }

  try {
    const userRef = doc(db, "users", username);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found. Please login again.");
      window.location.href = "login.html";
      return;
    }

    const userData = userSnap.data();
    if (userData.hasVoted) {
      alert("You have already voted!");
      window.location.href = "results.html";
      return;
    }

    const votesRef = doc(db, "votes", "results");
    const votesSnap = await getDoc(votesRef);

    if (!votesSnap.exists()) {
      await setDoc(votesRef, votesToAdd);
    } else {
      const currentVotes = votesSnap.data();
      const updatedVotes = {};

      for (const section of sections) {
        updatedVotes[section] = currentVotes[section].map(
          (count, idx) => count + votesToAdd[section][idx]
        );
      }

      await updateDoc(votesRef, updatedVotes);
    }

    await updateDoc(userRef, { hasVoted: true });

    alert("Vote submitted successfully!");
    window.location.href = "results.html";
  } catch (error) {
    console.error("Error submitting vote:", error);
    alert("Failed to submit vote. Please try again.");
  }
}

submitBtn.addEventListener("click", submitVote);
