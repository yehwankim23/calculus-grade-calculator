import { initializeApp } from "firebase/app";
import axios from "axios";
import { getAnalytics } from "firebase/analytics";

const firebaseApp = initializeApp(
  (
    await axios({
      method: "get",
      url: "https://tokens.yehwan.kim/tokens",
    })
  ).data
);

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
