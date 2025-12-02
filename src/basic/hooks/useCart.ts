import { useCallback, useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import * as cartModel from "../models/cart";
import { calculateCartTotal } from "../models/cart";

/**
 * 장바구니 관리를 위한 커스텀 훅
 */
export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = useCallback(
    (product: Product) => {
      const result = cartModel.addItemToCart(cart, product);
      if (result.success) {
        setCart(result.cart);
      }
      return result;
    },
    [cart, setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart(cartModel.removeItemFromCart(cart, productId));
    },
    [cart, setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, maxStock: number) => {
      const result = cartModel.updateCartItemQuantity(
        cart,
        productId,
        newQuantity,
        maxStock
      );
      if (result.success) {
        setCart(result.cart);
      }
      return result;
    },
    [cart, setCart]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, null).totalAfterDiscount;

      // percentage 쿠폰은 10,000원 이상 구매 시에만 사용 가능
      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        return {
          success: false,
          message: "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
        };
      }

      setSelectedCoupon(coupon);
      return { success: true, message: "쿠폰이 적용되었습니다." };
    },
    [cart]
  );

  const calculateTotal = useCallback(() => {
    return calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  const getRemainingStock = useCallback(
    (product: Product) => {
      return cartModel.getRemainingStock(product, cart);
    },
    [cart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart]);

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    getRemainingStock,
    clearCart,
    setSelectedCoupon,
  };
}
