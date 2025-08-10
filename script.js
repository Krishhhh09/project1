import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  increment
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

submitBtn.addEventListener("click", submitVote);

async function submitVote() {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("User not logged in!");
    window.location.href = "login.html";
    return;
  }

  // Map your section names to Firestore section IDs
  const sectionMap = {
    section1: "Best Leader",
    section2: "Best Innovator",
    section3: "Best Team Player",
    section4: "Best Communicator",
    section5: "Best Problem Solver"
  };

  // Map checkbox values to nominee names (must match Firestore nominee document IDs)
  const nomineeMap = {
    section1: ["Leader A", "Leader B", "Leader C", "Leader D"],
    section2: ["Innovator A", "Innovator B", "Innovator C", "Innovator D"],
    section3: ["Player A", "Player B", "Player C", "Player D"],
    section4: ["Communicator A", "Communicator B", "Communicator C", "Communicator D"],
    section5: ["Solver A", "Solver B", "Solver C", "Solver D"]
  };

  const sections = ["section1", "section2", "section3", "section4", "section5"];
  let votes = [];

  for (const section of sections) {
    const checkedBoxes = document.querySelectorAll(`input[name="${section}"]:checked`);
    if (checkedBoxes.length !== 2) {
      alert(`Please select exactly 2 candidates in ${sectionMap[section]}.`);
      return;
    }
    checkedBoxes.forEach(cb => {
      const nomineeIndex = parseInt(cb.value);
      const nomineeName = nomineeMap[section][nomineeIndex];
      votes.push({ section: sectionMap[section], nominee: nomineeName });
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
      window.location.href = "thankyou.html";
      return;
    }

    // Increment votes for each selected nominee
    for (const vote of votes) {
      const nomineeRef = doc(db, "sections", vote.section, "nominees", vote.nominee);
      await updateDoc(nomineeRef, { votes: increment(1) });
    }

    await updateDoc(userRef, { hasVoted: true });

    alert("Vote submitted successfully!");
    window.location.href = "thankyou.html";
  } catch (error) {
    console.error("Error submitting vote:", error);
    alert("Failed to submit vote. Please try again.");
  }
}