const buttons = document.querySelector(".buttons");

if (document.cookie.split("id=")[1]?.split(";")[0] === undefined) {
  buttons.innerHTML += `
    <a href="https://calculus-grade-calculator.pages.dev/login">
      <div class="button">Login</div>
    </a>
  `;
} else {
  buttons.innerHTML += `
    <button id="logout">Logout</button>
  `;

  document.querySelector("#logout").addEventListener("click", () => {
    document.cookie = `id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.href = "https://calculus-grade-calculator.pages.dev";
  });
}

function calculate() {
  let quizSum = 0;
  let quizMin = 10;

  document.querySelectorAll(".quiz").forEach((element) => {
    const quiz = Number(element.value);
    quizSum += quiz;

    if (quiz < quizMin) {
      quizMin = quiz;
    }
  });

  quizSum -= quizMin;

  let option1 =
    Number(document.querySelector("#attendance").value) * 0.05 +
    Number(document.querySelector("#homework").value) * 0.1 +
    Number(quizSum) * 0.2 +
    Number(document.querySelector("#extraCredit").value);

  let option2 = option1;

  const midterm1 = Number(document.querySelector("#midterm1").value);
  const midterm2 = Number(document.querySelector("#midterm2").value);
  const finalExam = Number(document.querySelector("#finalExam").value);

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
    document.querySelector(`#${id}`).value = 100;
  });

  document.querySelector("#extraCredit").value = 0;

  for (let number = 1; number <= 11; number++) {
    document.querySelector(`#quiz${number}`).value = 10;
  }

  calculate();
});

calculate();
