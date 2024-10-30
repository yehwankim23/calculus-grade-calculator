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
  document.querySelector(".buttons").innerHTML = `
    <div id="logout" class="button">Logout</div>
    <div id="reset" class="button">Reset</div>
  `;

  document.querySelector("#logout").addEventListener("click", () => {
    document.cookie = `id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.href = "https://calculus-grade-calculator.pages.dev";
  });

  document.querySelector(".content").style.display = "flex";

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
  };

  function calculateFinalScore() {
    let quizSum = 0;
    let quizMin = 10;

    for (let number = 1; number <= 10; number++) {
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
      Number((quizSum / 90) * 100) * 0.2 +
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

    return finalScore.toString().slice(0, 5);
  }

  const userDocument = doc(firestore, "users", id);

  const scores = (await getDoc(userDocument)).data()["scores"];

  inputs["attendance"].value = scores["attendance"];
  inputs["homework"].value = scores["homework"];
  inputs["midterm1"].value = scores["midterm_exam_1"];
  inputs["midterm2"].value = scores["midterm_exam_2"];
  inputs["finalExam"].value = scores["final_exam"];
  inputs["extraCredit"].value = scores["extra_credit"];
  inputs["quiz1"].value = scores["quiz_01"];
  inputs["quiz2"].value = scores["quiz_02"];
  inputs["quiz3"].value = scores["quiz_03"];
  inputs["quiz4"].value = scores["quiz_04"];
  inputs["quiz5"].value = scores["quiz_05"];
  inputs["quiz6"].value = scores["quiz_06"];
  inputs["quiz7"].value = scores["quiz_07"];
  inputs["quiz8"].value = scores["quiz_08"];
  inputs["quiz9"].value = scores["quiz_09"];
  inputs["quiz10"].value = scores["quiz_10"];

  calculateFinalScore();

  async function saveScores(finalScore) {
    await updateDoc(userDocument, {
      scores: {
        final_score: finalScore,
        attendance: inputs["attendance"].value,
        homework: inputs["homework"].value,
        midterm_exam_1: inputs["midterm1"].value,
        midterm_exam_2: inputs["midterm2"].value,
        final_exam: inputs["finalExam"].value,
        extra_credit: inputs["extraCredit"].value,
        quiz_01: inputs["quiz1"].value,
        quiz_02: inputs["quiz2"].value,
        quiz_03: inputs["quiz3"].value,
        quiz_04: inputs["quiz4"].value,
        quiz_05: inputs["quiz5"].value,
        quiz_06: inputs["quiz6"].value,
        quiz_07: inputs["quiz7"].value,
        quiz_08: inputs["quiz8"].value,
        quiz_09: inputs["quiz9"].value,
        quiz_10: inputs["quiz10"].value,
      },
    });
  }

  document.querySelectorAll("input").forEach((element) => {
    element.addEventListener("input", async () => {
      await saveScores(calculateFinalScore());
    });
  });

  document.querySelector("#reset").addEventListener("click", () => {
    ["attendance", "homework", "midterm1", "midterm2", "finalExam"].forEach((id) => {
      inputs[id].value = 100;
    });

    inputs["extraCredit"].value = 0;

    for (let number = 1; number <= 10; number++) {
      inputs[`quiz${number}`].value = 10;
    }

    calculateFinalScore();
  });
}
