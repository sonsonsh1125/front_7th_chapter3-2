import { useCallback } from "react";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { ProductWithUI, initialProducts } from "../constants";

/**
 * 상품 관리를 위한 커스텀 훅
 */
export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      return { success: true, message: "상품이 추가되었습니다." };
    },
    [setProducts]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      return { success: true, message: "상품이 수정되었습니다." };
    },
    [setProducts]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      return { success: true, message: "상품이 삭제되었습니다." };
    },
    [setProducts]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
