import "@/app.css";
import form from "@/form";
import result from "@/result";

let resultEL;

document.addEventListener("DOMContentLoaded", async () => {
  const formEL = document.createElement("div");
  formEL.innerHTML = form.render();
  document.body.appendChild(formEL);

  resultEL = document.createElement("div");
  resultEL.innerHTML = await result.render();
  document.body.appendChild(resultEL);
});

// if (module.hot) {
//   console.log("핫 모듈 켜짐");

//   module.hot.accept("./result", async () => {
//     resultEL.innerHTML = await result.render();
//   });
// }

// webpack의 모드 정보를 출력해준다.
// console.log(process.env.NODE_ENV);
// console.log(TWO);
// console.log(TWO_STRING);
// console.log(api.domain);
