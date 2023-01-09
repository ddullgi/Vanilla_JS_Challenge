const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    // 번들러의 시작 파일 설정(의존의 시작점)
    main: "./src/app.js",
  },
  output: {
    // 빌드 파일의 위치 설정
    path: path.resolve("./dist"),
    // 빌드 파일의 이름을 동적으로 설정
    filename: "[name].js",
  },
};
