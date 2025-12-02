import { CartItem, Coupon, Product } from "../../types";
import { calculateItemTotal } from "./discount";

/**
 * 장바구니의 총 금액을 계산합니다
 * @param cart - 장바구니 아이템 목록
 * @param selectedCoupon - 선택된 쿠폰
 * @returns 할인 전/후 금액 객체
 */
export function calculateCartTotal(
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  // 쿠폰 할인 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
      );
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
}

/**
 * 상품의 남은 재고를 계산합니다
 * @param product - 상품 정보
 * @param cart - 장바구니 목록
 * @returns 남은 재고 수량
 */
export function getRemainingStock(product: Product, cart: CartItem[]): number {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
}

/**
 * 장바구니에 아이템을 추가합니다
 * @param cart - 현재 장바구니
 * @param product - 추가할 상품
 * @returns 업데이트된 장바구니와 결과 메시지
 */
export function addItemToCart(
  cart: CartItem[],
  product: Product
): { cart: CartItem[]; success: boolean; message: string } {
  const remainingStock = getRemainingStock(product, cart);

  if (remainingStock <= 0) {
    return {
      cart,
      success: false,
      message: "재고가 부족합니다!",
    };
  }

  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;

    if (newQuantity > product.stock) {
      return {
        cart,
        success: false,
        message: `재고는 ${product.stock}개까지만 있습니다.`,
      };
    }

    return {
      cart: cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      ),
      success: true,
      message: "장바구니에 담았습니다",
    };
  }

  return {
    cart: [...cart, { product, quantity: 1 }],
    success: true,
    message: "장바구니에 담았습니다",
  };
}

/**
 * 장바구니에서 아이템을 제거합니다
 */
export function removeItemFromCart(
  cart: CartItem[],
  productId: string
): CartItem[] {
  return cart.filter((item) => item.product.id !== productId);
}

/**
 * 장바구니 아이템의 수량을 업데이트합니다
 */
export function updateCartItemQuantity(
  cart: CartItem[],
  productId: string,
  newQuantity: number,
  maxStock: number
): { cart: CartItem[]; success: boolean; message?: string } {
  if (newQuantity <= 0) {
    return {
      cart: removeItemFromCart(cart, productId),
      success: true,
    };
  }

  if (newQuantity > maxStock) {
    return {
      cart,
      success: false,
      message: `재고는 ${maxStock}개까지만 있습니다.`,
    };
  }

  return {
    cart: cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    ),
    success: true,
  };
}
