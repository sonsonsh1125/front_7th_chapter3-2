/**
 * 검증 유틸리티 함수들
 */

/**
 * 문자열에서 숫자만 추출합니다
 * @param value - 입력 문자열
 * @returns 숫자만 포함된 문자열
 */
export function extractNumbers(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * 가격이 유효한지 검증합니다 (양수)
 * @param price - 검증할 가격
 * @returns 유효 여부
 */
export function isValidPrice(price: number): boolean {
  return price > 0;
}

/**
 * 재고 수량이 유효한지 검증합니다 (0 이상)
 * @param stock - 검증할 재고 수량
 * @returns 유효 여부
 */
export function isValidStock(stock: number): boolean {
  return stock >= 0;
}

/**
 * 재고 수량이 범위 내에 있는지 검증합니다
 * @param stock - 검증할 재고 수량
 * @param max - 최대값 (기본값: 9999)
 * @returns 유효 여부
 */
export function isValidStockRange(stock: number, max: number = 9999): boolean {
  return stock >= 0 && stock <= max;
}

/**
 * 쿠폰 코드 형식이 유효한지 검증합니다 (4-12자 영문 대문자와 숫자)
 * @param code - 검증할 쿠폰 코드
 * @returns 유효 여부
 */
export function isValidCouponCode(code: string): boolean {
  const pattern = /^[A-Z0-9]{4,12}$/;
  return pattern.test(code);
}

/**
 * 할인율이 유효한지 검증합니다 (0-100%)
 * @param rate - 검증할 할인율
 * @returns 유효 여부
 */
export function isValidDiscountRate(rate: number): boolean {
  return rate >= 0 && rate <= 100;
}

/**
 * 할인 금액이 유효한지 검증합니다 (0-100,000원)
 * @param amount - 검증할 할인 금액
 * @param max - 최대값 (기본값: 100000)
 * @returns 유효 여부
 */
export function isValidDiscountAmount(
  amount: number,
  max: number = 100000
): boolean {
  return amount >= 0 && amount <= max;
}

/**
 * 숫자 문자열이 유효한지 검증합니다 (숫자만 포함)
 * @param value - 검증할 문자열
 * @returns 유효 여부
 */
export function isNumericString(value: string): boolean {
  return value === "" || /^\d+$/.test(value);
}


