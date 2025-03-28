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

if (id !== undefined) {
  const userDocument = doc(firestore, "users", id);

  function logout() {
    document.cookie = `id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.href = "https://calculus-grade-calculator.pages.dev";
  }

  if (!(await getDoc(userDocument)).exists()) {
    logout();
  }

  document.querySelector(".buttons").innerHTML = `
    <div id="logout" class="button">Logout</div>
    <div id="reset" class="button">Reset</div>
  `;

  document.querySelector("#logout").addEventListener("click", () => {
    logout();
  });

  document.querySelector(".content").style.display = "flex";

  const settings = (await getDoc(doc(firestore, "settings", "settings"))).data();
  const quizCount = settings["quiz_count"];

  const odd = document.querySelector("#odd");
  const even = document.querySelector("#even");

  for (let number = 1; number <= quizCount; number++) {
    (number % 2 === 0 ? even : odd).innerHTML += `
      <div class="row">
        <span class="title">Quiz ${number}</span>
        <input id="quiz${number}" class="quiz" type="number" inputmode="decimal" min="0" value="10" />
      </div>
    `;
  }

  const scores = (await getDoc(userDocument)).data()["scores"];
  let quizzes = scores["7_quizzes"];

  for (let count = quizzes.length; count < quizCount; count++) {
    quizzes.push("10");
  }

  await updateDoc(userDocument, { "scores.7_quizzes": quizzes });

  let inputs = {
    attendance: document.querySelector("#attendance"),
    homework: document.querySelector("#homework"),
    midterm1: document.querySelector("#midterm1"),
    midterm2: document.querySelector("#midterm2"),
    finalExam: document.querySelector("#finalExam"),
    extraCredit: document.querySelector("#extraCredit"),
    quizzes: [],
  };

  for (let number = 1; number <= quizCount; number++) {
    inputs["quizzes"].push(document.querySelector(`#quiz${number}`));
  }

  function calculateFinalScore() {
    let quizScores = [];
    let quizSum = 0;

    for (let index = 0; index < quizCount; index++) {
      const quiz = Number(inputs["quizzes"][index].value);
      quizScores.push(quiz);
      quizSum += quiz;
    }

    quizScores.sort((a, b) => {
      return a - b;
    });

    const quizDrop = settings["quiz_drop"];

    for (let index = 0; index < quizDrop; index++) {
      quizSum -= quizScores[index];
    }

    let option1 =
      (Number(inputs["attendance"].value) * settings["attendance"]) / 100 +
      (Number(inputs["homework"].value) * settings["homework"]) / 100 +
      (Number((quizSum / (quizCount - quizDrop)) * 10) * settings["quiz"]) / 100 +
      Number(inputs["extraCredit"].value);

    let option2 = option1;

    const midterm1 = Number(inputs["midterm1"].value);
    const midterm2 = Number(inputs["midterm2"].value);
    const finalExam = Number(inputs["finalExam"].value);

    option1 +=
      (midterm1 * settings["midterm"]) / 100 +
      (midterm2 * settings["midterm"]) / 100 +
      (finalExam * settings["final_exam_1"]) / 100;

    const lowerMidterm = Math.min(midterm1, midterm2);
    const higherMidterm = Math.max(midterm1, midterm2);

    option2 +=
      (lowerMidterm * settings["lower_midterm"]) / 100 +
      (higherMidterm * settings["higher_midterm"]) / 100 +
      (finalExam * settings["final_exam_2"]) / 100;

    document.querySelector("#option1").innerText = option1.toString().slice(0, 5);
    document.querySelector("#option2").innerText = option2.toString().slice(0, 5);

    document.querySelectorAll(".grade").forEach((element) => {
      element.classList.remove("red", "orange", "green", "blue");
    });

    const finalScore = Math.max(option1, option2);

    if (finalScore >= 94) {
      document.querySelector("#a").classList.add("blue");
    } else if (finalScore >= 90) {
      document.querySelector("#a-minus").classList.add("blue");
    } else if (finalScore >= 87) {
      document.querySelector("#b-plus").classList.add("green");
    } else if (finalScore >= 83) {
      document.querySelector("#b").classList.add("green");
    } else if (finalScore >= 80) {
      document.querySelector("#b-minus").classList.add("green");
    } else if (finalScore >= 77) {
      document.querySelector("#c-plus").classList.add("orange");
    } else if (finalScore >= 73) {
      document.querySelector("#c").classList.add("orange");
    } else if (finalScore >= 70) {
      document.querySelector("#c-minus").classList.add("red");
    }

    return finalScore.toString().slice(0, 5);
  }

  inputs["attendance"].value = scores["1_attendance"];
  inputs["homework"].value = scores["2_homework"];
  inputs["midterm1"].value = scores["3_midterm_1"];
  inputs["midterm2"].value = scores["4_midterm_2"];
  inputs["finalExam"].value = scores["5_final_exam"];
  inputs["extraCredit"].value = scores["6_extra_credit"];

  for (let index = 0; index < quizCount; index++) {
    inputs["quizzes"][index].value = scores["7_quizzes"][index];
  }

  async function saveScores(finalScore) {
    let quizzes = [];

    for (let index = 0; index < quizCount; index++) {
      quizzes.push(inputs["quizzes"][index].value);
    }

    await updateDoc(userDocument, {
      scores: {
        "0_final_score": finalScore,
        "1_attendance": inputs["attendance"].value,
        "2_homework": inputs["homework"].value,
        "3_midterm_1": inputs["midterm1"].value,
        "4_midterm_2": inputs["midterm2"].value,
        "5_final_exam": inputs["finalExam"].value,
        "6_extra_credit": inputs["extraCredit"].value,
        "7_quizzes": quizzes,
      },
    });
  }

  await saveScores(calculateFinalScore());

  document.querySelectorAll("input").forEach((element) => {
    element.addEventListener("input", async () => {
      await saveScores(calculateFinalScore());
    });
  });

  document.querySelector("#reset").addEventListener("click", async () => {
    ["attendance", "homework", "midterm1", "midterm2", "finalExam"].forEach((id) => {
      inputs[id].value = 100;
    });

    inputs["extraCredit"].value = 0;

    for (let index = 0; index < quizCount; index++) {
      inputs["quizzes"][index].value = 10;
    }

    await saveScores(calculateFinalScore());
  });
}
