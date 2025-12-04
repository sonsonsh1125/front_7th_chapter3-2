import { CartItem } from "../../types";

/**
 * 장바구니 아이템에 적용 가능한 최대 할인율을 계산합니다
 * @param item - 장바구니 아이템
 * @param cart - 전체 장바구니 (대량 구매 체크용)
 * @returns 최대 할인율 (0~0.5)
 */
export function getMaxApplicableDiscount(
  item: CartItem,
  cart: CartItem[]
): number {
  const { discounts } = item.product;
  const { quantity } = item;

  // 기본 할인율 계산
  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  // 대량 구매 추가 할인 (10개 이상 구매 시 5% 추가, 최대 50%)
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
}

/**
 * 개별 장바구니 아이템의 최종 가격을 계산합니다
 * @param item - 장바구니 아이템
 * @param cart - 전체 장바구니
 * @returns 할인이 적용된 최종 금액
 */
export function calculateItemTotal(item: CartItem, cart: CartItem[]): number {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
}

/**
 * 개별 아이템의 할인율을 계산합니다
 * @param item - 장바구니 아이템
 * @param cart - 전체 장바구니
 * @returns 할인율 (0~100)
 */
export function calculateItemDiscountRate(
  item: CartItem,
  cart: CartItem[]
): number {
  const itemTotal = calculateItemTotal(item, cart);
  const originalPrice = item.product.price * item.quantity;
  if (itemTotal >= originalPrice) return 0;
  return Math.round((1 - itemTotal / originalPrice) * 100);
}
