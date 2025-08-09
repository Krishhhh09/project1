// login.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBIaEhEH5bJNaqY92TRZ6RTc29EDaJx4LA",
    authDomain: "voting-app-3a0d0.firebaseapp.com",
    projectId: "voting-app-3a0d0",
    storageBucket: "voting-app-3a0d0.firebasestorage.app",
    messagingSenderId: "SENDER",
    appId: "1:919899924480:web:c1b4c71a88e940714dd0e5"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("User").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please fill in both fields.");
    return;
  }

  try {
    const userRef = doc(db, "users", username);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User does not exist.");
      return;
    }

    const userData = userSnap.data();

    if (userData.password !== password) {
      alert("Wrong password.");
      return;
    }

    if (userData.hasVoted) {
      alert("You have already voted.");
      return;
    }

    // Save username to localStorage for vote page
    localStorage.setItem("username", username);

    // Redirect to vote page
    window.location.href = "vote.html";

  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login.");
  }
});
