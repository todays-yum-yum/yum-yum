// jest 바벨 설정
module.exports = {
  presets: [
    // 현재 환경에 필요한 문법 변환
    '@babel/preset-env',
    // JSX 문법을
    // 브라우저가 이해할 수 있는 일반 자바스크립트로 변환
    ['@babel/preset-react', {
      // React 17 버전 이상에서 필요한 'import React from "react";' 코드를 자동으로 삽입
      runtime: 'automatic'
    }]
  ]
};