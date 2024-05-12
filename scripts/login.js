import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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

if (document.cookie.split("id=")[1]?.split(";")[0] !== undefined) {
  window.location.href = "https://calculus-grade-calculator.pages.dev";
} else {
  await Kakao.init("845d10741861549f7a7f981182fe747e");

  await Kakao.Auth.authorize({
    redirectUri: "https://calculus-grade-calculator.pages.dev/oauth",
    prompt: "select_account",
  });
}
