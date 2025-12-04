import { Coupon } from "../../types";

/**
 * 쿠폰 코드 중복 여부를 확인합니다
 * @param coupons - 기존 쿠폰 목록
 * @param newCoupon - 확인할 쿠폰
 * @returns 중복 여부
 */
export function isCouponCodeDuplicate(
  coupons: Coupon[],
  newCoupon: Coupon
): boolean {
  return coupons.some((c) => c.code === newCoupon.code);
}

/**
 * 쿠폰 목록에 새 쿠폰을 추가합니다
 * @param coupons - 기존 쿠폰 목록
 * @param newCoupon - 추가할 쿠폰
 * @returns 업데이트된 쿠폰 목록과 성공 여부
 */
export function addCoupon(
  coupons: Coupon[],
  newCoupon: Coupon
): { coupons: Coupon[]; success: boolean } {
  if (isCouponCodeDuplicate(coupons, newCoupon)) {
    return {
      coupons,
      success: false,
    };
  }

  return {
    coupons: [...coupons, newCoupon],
    success: true,
  };
}

/**
 * 쿠폰 목록에서 쿠폰을 제거합니다
 * @param coupons - 기존 쿠폰 목록
 * @param couponCode - 제거할 쿠폰 코드
 * @returns 업데이트된 쿠폰 목록
 */
export function removeCoupon(
  coupons: Coupon[],
  couponCode: string
): Coupon[] {
  return coupons.filter((c) => c.code !== couponCode);
}


