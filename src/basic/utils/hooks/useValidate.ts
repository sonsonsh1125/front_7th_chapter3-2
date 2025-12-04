import { useCallback } from "react";
import {
  extractNumbers,
  isValidPrice,
  isValidStock,
  isValidStockRange,
  isValidCouponCode,
  isValidDiscountRate,
  isValidDiscountAmount,
  isNumericString,
} from "../validators";

type NotifyFn = (
  message: string,
  type: "error" | "success" | "warning"
) => void;

/**
 * 유효성 검사를 위한 커스텀 훅
 * @param addNotification - 알림 함수 (옵션)
 */
export function useValidate(addNotification?: NotifyFn) {
  /**
   * 숫자만 입력 허용하는 핸들러
   * @param value - 입력값
   * @returns 숫자만 포함된 문자열 또는 빈 문자열
   */
  const handleNumericInput = useCallback((value: string): string => {
    if (value === "" || isNumericString(value)) {
      return value;
    }
    return extractNumbers(value);
  }, []);

  /**
   * 가격 입력값을 검증하고 포맷팅합니다
   * @param value - 입력값
   * @param onError - 에러 발생 시 콜백
   * @returns 검증된 숫자값 (에러 시 0)
   */
  const validatePrice = useCallback(
    (value: string, onError?: (message: string) => void): number => {
      if (value === "") return 0;

      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        const message = "가격은 0보다 커야 합니다";
        addNotification?.(message, "error");
        onError?.(message);
        return 0;
      }

      if (!isValidPrice(numValue)) {
        const message = "가격은 0보다 커야 합니다";
        addNotification?.(message, "error");
        onError?.(message);
        return 0;
      }

      return numValue;
    },
    [addNotification]
  );

  /**
   * 재고 입력값을 검증하고 포맷팅합니다
   * @param value - 입력값
   * @param onError - 에러 발생 시 콜백
   * @returns 검증된 숫자값 (에러 시 0 또는 9999)
   */
  const validateStock = useCallback(
    (value: string, onError?: (message: string) => void): number => {
      if (value === "") return 0;

      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        const message = "재고는 0보다 커야 합니다";
        addNotification?.(message, "error");
        onError?.(message);
        return 0;
      }

      if (!isValidStockRange(numValue)) {
        const message = "재고는 9999개를 초과할 수 없습니다";
        addNotification?.(message, "error");
        onError?.(message);
        return 9999;
      }

      return numValue;
    },
    [addNotification]
  );

  /**
   * 쿠폰 코드를 검증합니다
   * @param code - 쿠폰 코드
   * @param onError - 에러 발생 시 콜백
   * @returns 유효 여부
   */
  const validateCouponCode = useCallback(
    (code: string, onError?: (message: string) => void): boolean => {
      if (!isValidCouponCode(code)) {
        const message = "쿠폰 코드는 4-12자 영문 대문자와 숫자만 사용 가능합니다";
        addNotification?.(message, "error");
        onError?.(message);
        return false;
      }
      return true;
    },
    [addNotification]
  );

  /**
   * 할인율을 검증합니다
   * @param rate - 할인율 (0-100)
   * @param onError - 에러 발생 시 콜백
   * @returns 검증된 할인율 (에러 시 0 또는 100)
   */
  const validateDiscountRate = useCallback(
    (rate: number, onError?: (message: string) => void): number => {
      if (rate < 0) {
        return 0;
      }

      if (!isValidDiscountRate(rate)) {
        const message = "할인율은 100%를 초과할 수 없습니다";
        addNotification?.(message, "error");
        onError?.(message);
        return 100;
      }

      return rate;
    },
    [addNotification]
  );

  /**
   * 할인 금액을 검증합니다
   * @param amount - 할인 금액
   * @param onError - 에러 발생 시 콜백
   * @returns 검증된 할인 금액 (에러 시 0 또는 100000)
   */
  const validateDiscountAmount = useCallback(
    (amount: number, onError?: (message: string) => void): number => {
      if (amount < 0) {
        return 0;
      }

      if (!isValidDiscountAmount(amount)) {
        const message = "할인 금액은 100,000원을 초과할 수 없습니다";
        addNotification?.(message, "error");
        onError?.(message);
        return 100000;
      }

      return amount;
    },
    [addNotification]
  );

  /**
   * 숫자 입력 필드의 onChange 핸들러
   * @param value - 입력값
   * @param setValue - 상태 업데이트 함수
   */
  const handleNumericChange = useCallback(
    <T extends { [key: string]: any }>(
      value: string,
      setValue: (updater: T | ((prev: T) => T)) => void,
      fieldName: keyof T
    ) => {
      const numericValue = handleNumericInput(value);
      setValue((prev: T) => ({
        ...prev,
        [fieldName]: numericValue === "" ? 0 : parseInt(numericValue),
      }));
    },
    [handleNumericInput]
  );

  /**
   * 숫자 입력 필드의 onBlur 핸들러 (가격용)
   * @param value - 입력값
   * @param setValue - 상태 업데이트 함수
   * @param fieldName - 필드명
   */
  const handlePriceBlur = useCallback(
    (
      value: string,
      setValue: (updater: any) => void,
      fieldName: string
    ) => {
      const validatedValue = validatePrice(value);
      setValue((prev: any) => ({
        ...prev,
        [fieldName]: validatedValue,
      }));
    },
    [validatePrice]
  );

  /**
   * 숫자 입력 필드의 onBlur 핸들러 (재고용)
   * @param value - 입력값
   * @param setValue - 상태 업데이트 함수
   * @param fieldName - 필드명
   */
  const handleStockBlur = useCallback(
    (
      value: string,
      setValue: (updater: any) => void,
      fieldName: string
    ) => {
      const validatedValue = validateStock(value);
      setValue((prev: any) => ({
        ...prev,
        [fieldName]: validatedValue,
      }));
    },
    [validateStock]
  );

  return {
    // 검증 함수들
    validatePrice,
    validateStock,
    validateCouponCode,
    validateDiscountRate,
    validateDiscountAmount,
    // 입력 핸들러들
    handleNumericInput,
    handleNumericChange,
    handlePriceBlur,
    handleStockBlur,
    // 유틸리티 함수들
    extractNumbers,
    isValidPrice,
    isValidStock,
    isValidStockRange,
    isValidCouponCode,
    isValidDiscountRate,
    isValidDiscountAmount,
    isNumericString,
  };
}

