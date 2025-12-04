import { ProductWithUI } from "../constants";

/**
 * 상품 목록을 검색어로 필터링합니다
 * @param products - 상품 목록
 * @param searchTerm - 검색어
 * @returns 필터링된 상품 목록
 */
export function filterProducts(
  products: ProductWithUI[],
  searchTerm: string
): ProductWithUI[] {
  if (!searchTerm) return products;

  const lowerSearchTerm = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description &&
        product.description.toLowerCase().includes(lowerSearchTerm))
  );
}

/**
 * 상품 목록에 새 상품을 추가합니다
 * @param products - 기존 상품 목록
 * @param newProduct - 추가할 상품 (id 제외)
 * @returns 업데이트된 상품 목록과 생성된 상품
 */
export function addProduct(
  products: ProductWithUI[],
  newProduct: Omit<ProductWithUI, "id">
): { products: ProductWithUI[]; product: ProductWithUI } {
  const product: ProductWithUI = {
    ...newProduct,
    id: `p${Date.now()}`,
  };

  return {
    products: [...products, product],
    product,
  };
}

/**
 * 상품 정보를 업데이트합니다
 * @param products - 기존 상품 목록
 * @param productId - 업데이트할 상품 ID
 * @param updates - 업데이트할 필드
 * @returns 업데이트된 상품 목록
 */
export function updateProduct(
  products: ProductWithUI[],
  productId: string,
  updates: Partial<ProductWithUI>
): ProductWithUI[] {
  return products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );
}

/**
 * 상품 목록에서 상품을 제거합니다
 * @param products - 기존 상품 목록
 * @param productId - 제거할 상품 ID
 * @returns 업데이트된 상품 목록
 */
export function removeProduct(
  products: ProductWithUI[],
  productId: string
): ProductWithUI[] {
  return products.filter((p) => p.id !== productId);
}


