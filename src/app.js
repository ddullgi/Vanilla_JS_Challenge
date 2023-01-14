import "./app.css";
// import nyancat from "./nyancat.jpg";
import axios from "axios";

document.addEventListener("DOMContentLoaded", async () => {
  const res = await axios.get("/api/users");
  console.log(res.data);

  document.body.innerHTML = (res.data || [])
    .map((user) => {
      return `<div>${user.id}: ${user.name}</div>`;
    })
    .join("");
});

// webpack의 모드 정보를 출력해준다.
// console.log(process.env.NODE_ENV);
// console.log(TWO);
// console.log(TWO_STRING);
// console.log(api.domain);
