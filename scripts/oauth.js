import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";

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

const code = window.location.search.split("code=")[1]?.split("&")[0];

if (document.cookie.split("id=")[1]?.split(";")[0] === undefined && code !== undefined) {
  await axios({
    method: "post",
    url: "https://kauth.kakao.com/oauth/token",
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    params: {
      grant_type: "authorization_code",
      client_id: "1b195ae50a9bde0f66e9299b08fd408e",
      redirect_uri: "https://calculus-grade-calculator.pages.dev/oauth",
      code: code,
    },
  }).then(async (axiosResponse) => {
    await Kakao.init("845d10741861549f7a7f981182fe747e");
    await Kakao.Auth.setAccessToken(axiosResponse.data.access_token);
  });

  const kakaoResponse = await Kakao.API.request({
    url: "/v2/user/me",
  });

  const id = String(kakaoResponse.id);

  document.cookie = `id=${id}; expires=${new Date(
    new Date().getTime() + 6 * 24 * 60 * 60 * 1000
  ).toUTCString()}; path=/;`;

  const userDocument = doc(firestore, "users", id);

  if (!(await getDoc(userDocument)).exists()) {
    await setDoc(userDocument, {
      name: kakaoResponse.properties.nickname,
      scores: {
        attendance: "100",
        homework: "100",
        midterm1: "100",
        midterm2: "100",
        finalExam: "100",
        extraCredit: "0",
        quiz1: "10",
        quiz2: "10",
        quiz3: "10",
        quiz4: "10",
        quiz5: "10",
        quiz6: "10",
        quiz7: "10",
        quiz8: "10",
        quiz9: "10",
        quiz10: "10",
        quiz11: "10",
      },
    });
  }
}

window.location.href = "https://calculus-grade-calculator.pages.dev";
