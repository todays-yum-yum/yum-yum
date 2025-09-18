import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  initializeAuth,
  browserSessionPersistence,
  indexedDBLocalPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';

// firebase 설정
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);

// authentication 설정
export const auth = initializeAuth(app, {
  persistence: [
    indexedDBLocalPersistence, // 브라우저가 종료되어도 유지, 모바일에서 더 안정적
    browserLocalPersistence, // 브라우저가 종료되어도 유지, 호환성
  ],
});

// Gemini Developer API 백엔드 서비스
const ai = getAI(app, { backend: new GoogleAIBackend() });
// Gemini 모델 호출
export const model = getGenerativeModel(ai, { model: 'gemini-2.5-flash' });
