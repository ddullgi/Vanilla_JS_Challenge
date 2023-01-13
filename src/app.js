import "./app.css";
import nyancat from "./nyancat.jpg";

document.addEventListener("DOMContentLoaded", () => {
  document.body.innerHTML = `
    <img src="${nyancat}" />
  `;
});

// webpack의 모드 정보를 출력해준다.
// console.log(process.env.NODE_ENV);
// console.log(TWO);
// console.log(TWO_STRING);
// console.log(api.domain);
