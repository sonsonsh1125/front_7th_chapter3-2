import { useCallback } from "react";
import { Coupon } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { initialCoupons } from "../constants";

/**
 * 쿠폰 관리를 위한 커스텀 훅
 */
export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        return { success: false, message: "이미 존재하는 쿠폰 코드입니다." };
      }
      setCoupons((prev) => [...prev, newCoupon]);
      return { success: true, message: "쿠폰이 추가되었습니다." };
    },
    [coupons, setCoupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      return { success: true, message: "쿠폰이 삭제되었습니다." };
    },
    [setCoupons]
  );

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
}
