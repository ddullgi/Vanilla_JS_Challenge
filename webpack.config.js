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
  module: {
    rules: [
      // 엔트리 포인트 부터 연결된 모든 파일을 순회하다 명시된 패턴의 파일들을 만나면 설정된 로더를 이용하여 파일을 돌린다.
      {
        // 로더가 처리해야되는 파일들의 패턴을 설정한다. (정규 표현식 사용)
        test: /\.css$/, // .css 확장자를 가지는 모든 파일을 로더로 돌리겠다는 의미
        // 사용할 로더를 명시
        // 로더는 한 패턴에 대하여 여러개를 실행할 수 있습니다.
        // 순서는 뒤에서부터 앞으로 실행된다.
        // 즉, css-loader 실행 후 style-loader를 실행한다. (순서 중요!)
        use: ["style-loader", "css-loader"],
        // css-loader의 경우 빌드된 js 안에 css 코드를 변환하여 넣어주기만 하기때문에 후처리를 통해 html에 적용되게 설정해야된다.(css-loader만으로는 바로 적용되지 않음)
        // style-loader는 자바스크립트로 변환된 style 코드를 html로 넣어주는 로더이다.
      },
      //! wbpack 버전4의 방식
      // {
      //   test: /\.(png|jpg|gif|svg)$/,
      //   // 로더 이름 설정
      //   loader: "url-loader",
      //   // asset 파일들을 불러오기 위한 로더 (file-loader의 기능이 합쳐짐)
      //   options: {
      //     // file-loader가 처리하는 파일을 모듈로 사용했을때 경로앞에 추가되는 문자열
      //     // output 경로가 ./dist/ 이므로 해당 문자열을 추가
      //     publicPath: "./dist/",
      //     // 파일로더가 파일을 output에 복사할 때 사용하는 파일 이름을 동적으로 표시
      //     // [원본파일명].[확장자명]?[캐시무력화를 위한 해시값]
      //     name: "[name].[ext]?[hash]",
      //     limit: 20000, // 20kb 이하의 용량을 base64로 변환한다. 이상일 경우 file-loader로 처리한다.
      //   },
      // },

      //* 버전 5는 자체 설정으로 설정한다
      // asset/resource : 별도의 파일을 내보내고 URL을 추출 (file-loader 대체)
      // asset/inline : asset의 data URI를 내보낸다. (url-loader 대체)
      // asset/source : asset의 소스 코드를 내보낸다. (raw-loader 대체)
      // asset은 data URI와 별도의 파일 내보내기 중에서 자동으로 선택
      {
        test: /\.(gif|jpe?g|png|webp|svg)$/i,
        type: "asset",
      },
    ],
  },
};