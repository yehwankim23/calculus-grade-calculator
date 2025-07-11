import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

const firebaseApp = initializeApp(
  (await axios.get("https://tokens.yehwan.kim/tokens")).data.firebase
);

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
  const nickname = kakaoResponse.properties.nickname;

  if ((await getDoc(userDocument)).exists()) {
    await updateDoc(userDocument, { nicknames: arrayUnion(nickname) });
  } else {
    await setDoc(userDocument, {
      nicknames: [nickname],
      scores: {
        "0_final_score": "100",
        "1_attendance": "100",
        "2_homework": "100",
        "3_midterm_1": "100",
        "4_midterm_2": "100",
        "5_final_exam": "100",
        "6_extra_credit": "0",
        "7_quizzes": [],
      },
    });
  }
}

window.location.href = "https://calculus-grade-calculator.pages.dev";
