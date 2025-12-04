import { useCallback, useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import * as cartModel from "../models/cart";
import { calculateCartTotal } from "../models/cart";
import { calculateItemTotal, calculateItemDiscountRate } from "../models/discount";
import { ProductWithUI } from "../constants";

type NotifyFn = (
  message: string,
  type: "error" | "success" | "warning"
) => void;

/**
 * 장바구니 관리를 위한 커스텀 훅
 * @param products - 상품 목록 (수량 업데이트 시 재고 확인용)
 * @param addNotification - 알림 함수 (옵션)
 */
export function useCart(
  products: ProductWithUI[] = [],
  addNotification?: NotifyFn
) {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 장바구니에 상품 추가
  const addToCart = useCallback(
    (product: Product) => {
      const result = cartModel.addItemToCart(cart, product);
      if (result.success) {
        setCart(result.cart);
      }
      addNotification?.(result.message, result.success ? "success" : "error");
    },
    [cart, setCart, addNotification]
  );

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback(
    (productId: string) => {
      setCart(cartModel.removeItemFromCart(cart, productId));
    },
    [cart, setCart]
  );

  // 수량 변경
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const result = cartModel.updateCartItemQuantity(
        cart,
        productId,
        newQuantity,
        product.stock
      );
      if (result.success) {
        setCart(result.cart);
      } else if (result.message) {
        addNotification?.(result.message, "error");
      }
    },
    [cart, setCart, products, addNotification]
  );

  // 쿠폰 적용
  const applyCoupon = useCallback(
    (coupon: Coupon | null) => {
      if (!coupon) {
        setSelectedCoupon(null);
        return;
      }

      const currentTotal = calculateCartTotal(cart, null).totalAfterDiscount;

      // percentage 쿠폰은 10,000원 이상 구매 시에만 사용 가능
      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification?.(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification?.("쿠폰이 적용되었습니다.", "success");
    },
    [cart, addNotification]
  );

  // 총액 계산 함수
  const calculateTotal = useCallback(() => {
    return calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  // 재고 확인
  const getRemainingStock = useCallback(
    (product: Product) => cartModel.getRemainingStock(product, cart),
    [cart]
  );

  // 장바구니 비우기
  const clearCart = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification?.(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart, addNotification]);

  // 개별 아이템 총액 계산 (UI에서 필요)
  const getItemTotal = useCallback(
    (item: CartItem) => calculateItemTotal(item, cart),
    [cart]
  );

  // 개별 아이템 할인율 계산 (UI에서 필요)
  const getItemDiscountRate = useCallback(
    (item: CartItem) => calculateItemDiscountRate(item, cart),
    [cart]
  );

  return {
    // 상태
    cart,
    selectedCoupon,
    // 액션
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCart,
    // 계산 함수
    calculateTotal,
    getRemainingStock,
    // UI 헬퍼 함수 (선택적)
    getItemTotal,
    getItemDiscountRate,
  };
}
