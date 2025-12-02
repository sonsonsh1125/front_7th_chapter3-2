import { useState, useEffect } from 'react';

/**
 * localStorage와 동기화되는 상태 관리 hook
 * @param key - localStorage 키
 * @param initialValue - 초기값
 * @returns [저장된 값, 값 설정 함수]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // localStorage에서 초기값 로드
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // 값이 변경되면 localStorage에 저장
  useEffect(() => {
    try {
      // 빈 배열이나 null은 삭제
      if (Array.isArray(storedValue) && storedValue.length === 0) {
        window.localStorage.removeItem(key);
      } else if (storedValue === null || storedValue === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.warn(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

