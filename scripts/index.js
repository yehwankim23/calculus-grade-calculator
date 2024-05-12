import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBsZDKyla0iRBlPvzAH7nnM2g4yZ0Z32qg",
  authDomain: "calculus-grade-calculato-f5e00.firebaseapp.com",
  projectId: "calculus-grade-calculato-f5e00",
  storageBucket: "calculus-grade-calculato-f5e00.appspot.com",
  messagingSenderId: "300676061",
  appId: "1:300676061:web:a4d73fd75da03b1b873c34",
  measurementId: "G-34HY7HMRHN",
});

const analytics = getAnalytics(firebaseApp);
const firestore = getFirestore(firebaseApp);

const id = document.cookie.split("id=")[1]?.split(";")[0];
const buttons = document.querySelector(".buttons");

const inputs = {
  attendance: document.querySelector("#attendance"),
  homework: document.querySelector("#homework"),
  midterm1: document.querySelector("#midterm1"),
  midterm2: document.querySelector("#midterm2"),
  finalExam: document.querySelector("#finalExam"),
  extraCredit: document.querySelector("#extraCredit"),
  quiz1: document.querySelector("#quiz1"),
  quiz2: document.querySelector("#quiz2"),
  quiz3: document.querySelector("#quiz3"),
  quiz4: document.querySelector("#quiz4"),
  quiz5: document.querySelector("#quiz5"),
  quiz6: document.querySelector("#quiz6"),
  quiz7: document.querySelector("#quiz7"),
  quiz8: document.querySelector("#quiz8"),
  quiz9: document.querySelector("#quiz9"),
  quiz10: document.querySelector("#quiz10"),
  quiz11: document.querySelector("#quiz11"),
};

if (id === undefined) {
  buttons.innerHTML += `
    <a href="https://calculus-grade-calculator.pages.dev/login">
      <div class="button">Login</div>
    </a>
  `;
} else {
  buttons.innerHTML += `
    <button id="logout">Logout</button>
    <button id="save">Save</button>
  `;

  document.querySelector("#logout").addEventListener("click", () => {
    document.cookie = `id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.href = "https://calculus-grade-calculator.pages.dev";
  });

  document.querySelector("#save").addEventListener("click", async () => {
    await updateDoc(doc(firestore, "users", id), {
      scores: {
        attendance: inputs["attendance"].value,
        homework: inputs["homework"].value,
        midterm1: inputs["midterm1"].value,
        midterm2: inputs["midterm2"].value,
        finalExam: inputs["finalExam"].value,
        extraCredit: inputs["extraCredit"].value,
        quiz1: inputs["quiz1"].value,
        quiz2: inputs["quiz2"].value,
        quiz3: inputs["quiz3"].value,
        quiz4: inputs["quiz4"].value,
        quiz5: inputs["quiz5"].value,
        quiz6: inputs["quiz6"].value,
        quiz7: inputs["quiz7"].value,
        quiz8: inputs["quiz8"].value,
        quiz9: inputs["quiz9"].value,
        quiz10: inputs["quiz10"].value,
        quiz11: inputs["quiz11"].value,
      },
    });

    alert("Saved");
  });
}

function calculate() {
  let quizSum = 0;
  let quizMin = 10;

  for (let number = 1; number <= 11; number++) {
    const quiz = Number(inputs[`quiz${number}`].value);
    quizSum += quiz;

    if (quiz < quizMin) {
      quizMin = quiz;
    }
  }

  quizSum -= quizMin;

  let option1 =
    Number(inputs["attendance"].value) * 0.05 +
    Number(inputs["homework"].value) * 0.1 +
    Number(quizSum) * 0.2 +
    Number(inputs["extraCredit"].value);

  let option2 = option1;

  const midterm1 = Number(inputs["midterm1"].value);
  const midterm2 = Number(inputs["midterm2"].value);
  const finalExam = Number(inputs["finalExam"].value);

  option1 += midterm1 * 0.2 + midterm2 * 0.2 + finalExam * 0.25;

  const lowerMidterm = Math.min(midterm1, midterm2);
  const higherMidterm = Math.max(midterm1, midterm2);

  option2 += lowerMidterm * 0.15 + higherMidterm * 0.2 + finalExam * 0.3;

  document.querySelector("#option1").innerText = option1.toString().slice(0, 5);
  document.querySelector("#option2").innerText = option2.toString().slice(0, 5);

  document.querySelectorAll(".grade").forEach((element) => {
    element.classList.remove("final-grade");
  });

  const finalScore = Math.max(option1, option2);

  if (finalScore >= 94) {
    document.querySelector("#a").classList.add("final-grade");
  } else if (finalScore >= 90) {
    document.querySelector("#a-minus").classList.add("final-grade");
  } else if (finalScore >= 87) {
    document.querySelector("#b-plus").classList.add("final-grade");
  } else if (finalScore >= 83) {
    document.querySelector("#b").classList.add("final-grade");
  } else if (finalScore >= 80) {
    document.querySelector("#b-minus").classList.add("final-grade");
  } else if (finalScore >= 77) {
    document.querySelector("#c-plus").classList.add("final-grade");
  } else if (finalScore >= 73) {
    document.querySelector("#c").classList.add("final-grade");
  } else if (finalScore >= 70) {
    document.querySelector("#c-minus").classList.add("final-grade");
  }
}

document.querySelectorAll("input").forEach((element) => {
  element.addEventListener("input", () => {
    calculate();
  });
});

document.querySelector("#reset").addEventListener("click", () => {
  ["attendance", "homework", "midterm1", "midterm2", "finalExam"].forEach((id) => {
    inputs[id].value = 100;
  });

  inputs["extraCredit"].value = 0;

  for (let number = 1; number <= 11; number++) {
    inputs[`quiz${number}`].value = 10;
  }

  calculate();
});

calculate();
