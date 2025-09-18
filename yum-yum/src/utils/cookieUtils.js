// 쿠키를 설정하고 가져오는 유틸함수
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

/**
 * 쿠키 설정 함수
 * @param {string} name
 * @param {string} value
 * @param {any} options?
 */
export const setCookie = (name, value, options = '') => {
  return cookies.set(name, value, { ...options });
};

/**
 * 쿠키 값 불러오는 함수
 * @param {string} name : 쿠키 이름
 */
export const getCookie = (name) => {
  return cookies.get(name);
};
