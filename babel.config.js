module.exports = {
  presets: [
    [
      //? preset-env는 ECMAScript2015+를 변환할 때 사용한다. 바벨 7 이전 버전에는 연도별로 각 프리셋을 제공했지만(babel-reset-es2015, babel-reset-es2016, babel-reset-es2017, babel-reset-latest) 지금은 env 하나로 합쳐졌다.
      "@babel/preset-env",
      {
        //* 목표로 하는 브라우저의 버전을 설정한다.
        targets: {
          chrome: "79", //* 크롬 79까지 지원하는 코드를 만든다.
          ie: "11",
        },
        //? babel은 작성한 코드를 es5에 대체가능한 코드로만 변환을 실행한다. 즉, 대체할 문법이 없다면 변환하지 않는다. 이를 해결하기 위해 변환 할 수 없는 문법을 es5로 구현한 코드조각을 추가해서 해결한다. 이 코드 조각을 모아 놓은 것을 폴리필이라고 한다. 주로 coreJS를 많이 사용한다.
        useBuiltIns: "usage", // 폴리필 사용 방식 지정 기본값은 false
        corejs: {
          // 폴리필 버전 지정
          version: 3,
        },
      },
    ],
    "@babel/preset-typescript",
  ],
};
