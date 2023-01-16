const path = require("path");
const webpack = require("webpack");
// 터미널 명령어를 실행 할 수 있다.
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// css 한줄로 압축
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const apiMocker = require("connect-api-mocker");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const mode = process.env.NODE_ENV || "development";

module.exports = {
  mode,
  entry: {
    // 번들러의 시작 파일 설정(의존의 시작점)
    main: "./src/app.ts",
  },
  devtool: "inline-source-map",
  output: {
    // 빌드 파일의 위치 설정
    path: path.resolve("./dist"),
    // 빌드 파일의 이름을 동적으로 설정
    filename: "[name].js",
    chunkFilename: "js/[name].chunk.js",
  },
  //* stats: 메시지 수준을 정할수 있다. 'none', 'errors-only', 'minimal', 'normal', 'verbose' 로 메세지 수준을 조절한다.
  //* npm start를 돌리고 node 콘솔에 나타나는 메세지 수준 조절
  stats: "errors-only",
  //* webpack 서버 설정
  devServer: {
    //* 서버가 시작된 후 브라우저를 열도록 dev-server에 지시합니다. 기본 브라우저를 열려면 true로 설정하세요.
    open: true,
    //* 개발 서버 포트 번호를 설정한다. 기본값은 8080.
    port: 8080,
    //* 다른 백앤드 서버를 사용할 경우 프록시 설정으로 cors error 방지 가능
    proxy: {
      "/api": "http://localhost:8081", // 프록시
    },
    static: {
      //* 정적파일을 제공할 경로. 기본값은 웹팩 아웃풋이다.
      // directory: path.join(__dirname, "dist"),
      //* 브라우져를 통해 접근하는 경로. 기본값은 '/' 이다.
      // publicPath: "/",
    },
    client: {
      //* 빌드시 에러나 경고를 브라우져 화면에 표시한다.
      overlay: {
        errors: true,
        warnings: false,
      },
      //* 브라우저에서 컴파일 진행률을 백분율로 출력합니다.
      progress: true,
    },
    // hot: "only",
    //* historyApiFallBack: 히스토리 API를 사용하는 SPA 개발시 설정한다. 404가 발생하면 index.html로 리다이렉트한다.
    historyApiFallback: true,
    //? 목업 api 만들 수 있음
    onBeforeSetupMiddleware: (devServer) => {
      devServer.app.use(apiMocker("/api", "mocks/api"));
    },
  },

  module: {
    rules: [
      // 엔트리 포인트 부터 연결된 모든 파일을 순회하다 명시된 패턴의 파일들을 만나면 설정된 로더를 이용하여 파일을 돌린다.
      {
        // 로더가 처리해야되는 파일들의 패턴을 설정한다. (정규 표현식 사용)
        test: /\.s?[ac]ss$/i, // .css 확장자를 가지는 모든 파일을 로더로 돌리겠다는 의미
        // 사용할 로더를 명시
        // 로더는 한 패턴에 대하여 여러개를 실행할 수 있습니다.
        // 순서는 뒤에서부터 앞으로 실행된다.
        // 즉, css-loader 실행 후 style-loader를 실행한다. (순서 중요!)
        use: [
          mode === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
        // css-loader의 경우 빌드된 js 안에 css 코드를 변환하여 넣어주기만 하기때문에 후처리를 통해 html에 적용되게 설정해야된다.(css-loader만으로는 바로 적용되지 않음)
        // style-loader는 자바스크립트로 변환된 style 코드를 html로 넣어주는 로더이다.
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        loader:
          //* 바벨 프리셋이나 플러그인을 webpack build에 적용시킨다.
          "babel-loader", // 바벨 로더를 추가한다
      },
      {
        //! wbpack 버전4의 방식
        // {
        //   test: /\.(png|jpg|gif|svg)$/,
        //   // 로더 이름 설정
        //   loader: "url-loader",
        //   // asset 파일들을 불러오기 위한 로더 (file-loader의 기능이 합쳐짐)
        //   options: {
        //     // file-loader가 처리하는 파일을 모듈로 사용했을때 경로앞에 추가되는 문자열
        //     // output 경로가 ./dist/ 이므로 해당 문자열을 추가
        //     //publicPath: "./dist/",
        //     // 파일로더가 파일을 output에 복사할 때 사용하는 파일 이름을 동적으로 표시
        //     // [원본파일명].[확장자명]?[캐시무력화를 위한 해시값]
        //     name: "[name].[ext]?[hash]",
        //     limit: 20000, // 20kb 이하의 용량을 base64로 변환한다. 이상일 경우 file-loader로 처리한다.
        //   },
        // },
      },
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
  // plugin을 클래스로 만들기 때문에 new를 써서 선언해준다.
  plugins: [
    // 빌드 결과물에 빌드 정보나 커밋 버전을 추가하는 프러그인이다.
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleString()}
        Commit Version: ${childProcess.execSync("git rev-parse --short HEAD")}
        Author: ${childProcess.execSync("git config user.name")}
      `,
    }),
    // 환경 변수를 직접 설정하는 플러그인이다.
    new webpack.DefinePlugin({
      // 그냥 정의 할 경우 문자열을 코드로 평가한다.
      TWO: "1+1",
      // 문자열 자체로 나타내고 싶을 경우 JSON.stringify를 실행하면 된다.
      TWO_STRING: JSON.stringify("1+1"),
      "api.domain": JSON.stringify("http://dev.api.domain.com"),
    }),
    // output 경로에 html 파일을 생성해준다.
    new HtmlWebpackPlugin({
      // 템플릿 경로를 설정한다.
      template: "./public/index.html",
      // 템플릿에서 사용할 변수를 설정해 준다.
      templateParameters: {
        env: mode === "development" ? "(개발용)" : "",
      },
      minify:
        mode === "development"
          ? false
          : {
              // 공백 제거
              collapseWhitespace: true,
              // 주석 제거
              removeComments: true,
            },
    }),
    // axios는 이미 node_modules에 위치해 있기 때문에 이를 웹팩 아웃풋 폴더에 옮기고 index.html에서 로딩해야한다.
    new CopyPlugin({
      patterns: [
        {
          from: "./node_modules/axios/dist/axios.min.js",
          to: "./axios.min.js", // 목적지 파일에 들어간다
        },
      ],
    }),
    // output 경로에 이미 빌드 파일이 있다면 output 경로를 비워준다.
    new CleanWebpackPlugin(),
    // 원래 빌드 결과인 js 파일에 css가 포함되어 있는데 이를 분리해준다.
    ...(mode === "development"
      ? []
      : [new MiniCssExtractPlugin({ filename: "[name].css", chunkFilename: "[id].css" })]),
  ],
  //? 최적화
  optimization: {
    // 코드 압축
    minimizer:
      mode === "production"
        ? [
            new CssMinimizerPlugin(),
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true,
                },
              },
            }),
          ]
        : [],
    splitChunks: {
      chunks: "all",
    },
  },
  //* axios같은 써드파티 라이브러리다. 패키지로 제공될때 이미 빌드 과정을 거쳤기 때문에 빌드 프로세스에서 제외하는 것이 좋다. 웹팩 설정중 externals가 바로 이러한 기능을 제공한다.
  externals: {
    axios: "axios",
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        extensions: [".js", ".ts"],
      }),
    ],
    extensions: [".js", ".ts"],
  },
};
