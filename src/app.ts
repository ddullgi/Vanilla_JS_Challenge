import "@/app.css";
import form from "@/form";
import Hompage from "./page/Hompage";
import NotFound from "./page/NotFound";

const Tag = "[app.ts]";

window.addEventListener("popstate", function (event) {
  console.log(Tag);
  const path = window.location.pathname;
  const formEL = document.createElement("div");

  switch (path) {
    case "/home":
      // showHomePage();
      formEL.innerHTML = Hompage.render();
      document.body.appendChild(formEL);
      console.log(Tag, "Hompage");
      break;
    // case "/about":
    //   showAboutPage();
    //   break;
    // case "/contact":
    //   showContactPage();
    //   break;
    default:
      formEL.innerHTML = NotFound.render();
      document.body.appendChild(formEL);
      console.log(Tag, "NotFound");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const formEL = document.createElement("div");
  formEL.innerHTML = form.render();
  document.body.appendChild(formEL);
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
