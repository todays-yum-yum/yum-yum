## 개발할 때 유의할 점

1. **경로 별칭(alias) 사용**
   - `@`는 `src` 디렉토리를 가리킵니다.  
     예시: `@/styles/index.css`처럼 `/`를 꼭 붙여서 사용해야 합니다.
   - Vite의 alias 설정과 VS Code의 jsconfig.json이 다를 수 있으니, import 경로를 정확히 확인하세요.

2. **필수 파일 및 폴더**
   - `@/styles/index.css` 등 import하는 파일이 실제로 존재해야 합니다.
   - 폴더/파일 이름의 대소문자도 정확히 맞춰주세요.

3. **Vite 개발 서버**
   - 파일을 추가/삭제/이동한 경우, Vite 개발 서버를 재시작해야 인식됩니다.
   - 명령어:
     ```bash
     npm run dev
     ```

4. **Tailwind CSS 사용**
   - Tailwind 관련 설정(`tailwindcss`, `@tailwindcss/vite`)이 포함되어 있습니다.
   - CSS 파일에 반드시 Tailwind의 기본 디렉티브(`@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`)를 추가하세요.
   - 공통 색상, 폰트는 index.css에 있습니다. 색상과 폰트는 공통 테마의 변수로 사용해주세요.
   - 자세한 사용방법은 [블로그-v4.0에 커스텀 스타일링 적용하기](https://alpha.velog.io/@one1_programmer/CSS-Tailwind-CSS-v4.0%EC%97%90-%EC%BB%A4%EC%8A%A4%ED%85%80-%EC%8A%A4%ED%83%80%EC%9D%BC%EB%A7%81-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0)를 참고해주세요.

   ```js
   return (
     <div classname='bg-gray-50 text-gray-900'>
       <h1 classname='text-2xl font-bold'>Primary 컬러와 NanumSquareRound</h1>
       <button classname='bg-secondary-primary hover:bg-secondary-hover text-white px-4 py-2 rounded'>
         Click me
       </button>
     </div>
   );
   ```

5. **React 19 버전**
   - React 19 버전이 사용되고 있으니, 공식 문서의 변경사항을 참고하세요.

6. **테스트 환경**
   - 테스트는 `jest`와 `@testing-library/react`를 사용합니다.
   - 테스트 파일은 `*.test.js` 또는 `*.spec.js`로 작성하세요.

7. **ESLint & Prettier**
   - 코드 스타일 및 린트 규칙이 **엄격하게 적용**됩니다.
   - 커밋 전에 `npm run lint`로 코드 검사를 **권장**합니다.

8. **라우팅**
   - `App.jsx` 에서 라우팅 관리를 하고 있습니다.
   - 09.03일 기준 로그인 처리가 되어있지 않아, `isAuthenticated`를 수동으로 처리해두었습니다.
     - 수동 처리 방법

     ```js
     // src/hooks/useAuth.js
     // 유저 로그인 상태 확인 훅
     import { useState } from 'react';

     export default function useAuth() {
       const [isAuthenticated, setIsAuthenticated] = useState(true); // 초기값을 true로 설정 (임시)

       // 이곳에서 쿠키를 확인하여 로그인 상태를 업데이트

       return { isAuthenticated };
     }
     ```

9. **상태 관리**
   - `zustand`를 사용합니다.  
     Redux와 사용법이 다르니, zustand 공식 문서를 참고하세요.

10. **SVG import**
    - `vite-plugin-svgr`를 통해 SVG 파일을 React 컴포넌트로 import할 수 있습니다.

    ```js
    // 상단에서 import 해서 사용합니다.
    import svgr from '@/assets/vite-plugin-svgr';
    ```

11. **Toaster**
    - `src/componets/layout`안의 레이아웃 파일에 `<Toaster />` 컴포넌트를 추가하여 토스트 메시지가 렌더링 될 공간을 설정해두었습니다.
    - 토스트 메시지 표현

    ```jsx
    import toast from 'react-hot-toast';

    // 메시지 표시
    toast('Hello World');

    // 성공 메시지
    toast.success('작업이 성공적으로 완료되었습니다!');

    // 에러 메시지
    toast.error('오류가 발생했습니다.');
    ```

---

이외에도 새로운 라이브러리를 추가하거나 설정을 변경할 때는, 공식 문서와 버전 호환성을 꼭 확인해주세요.
