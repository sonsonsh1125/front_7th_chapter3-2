import { Product, CartItem } from '../../types';
import { getRemainingStock } from '../models/cart';

/**
 * 가격을 형식에 맞게 포매팅합니다
 * @param price - 포매팅할 가격
 * @param options - 옵션 (관리자 모드, 상품 정보)
 * @returns 포매팅된 가격 문자열
 */
export function formatPrice(
  price: number, 
  options?: { 
    isAdmin?: boolean; 
    product?: Product; 
    cart?: CartItem[];
  }
): string {
  // 재고가 없으면 SOLD OUT 표시
  if (options?.product && options?.cart) {
    const remainingStock = getRemainingStock(options.product, options.cart);
    if (remainingStock <= 0) {
      return 'SOLD OUT';
    }
  }

  // 관리자 모드와 일반 모드의 가격 표시 방식 분리
  if (options?.isAdmin) {
    return `${price.toLocaleString()}원`;
  }
  
  return `₩${price.toLocaleString()}`;
}

