import { useState } from "react";
import { Product } from "../../../types";
import { ChevronDownIcon } from "../icons";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface ProductAccordionProps {
  products: ProductWithUI[];
  onEdit: (product: ProductWithUI) => void;
  onDelete: (id: string) => void;
  formatPrice: (price: number, productId?: string) => string;
}

export const ProductAccordion: React.FC<ProductAccordionProps> = ({
  products,
  onEdit,
  onDelete,
  formatPrice,
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (productId: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <div className="divide-y divide-gray-200" role="table">
      {products.map((product) => {
        const isOpen = openItems.has(product.id);

        return (
          <div key={product.id} className="bg-white">
            {/* 아코디언 헤더 */}
            <div className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <button
                onClick={() => toggleItem(product.id)}
                className="flex items-center space-x-4 flex-1"
              >
                <span className="font-medium text-gray-900">
                  {product.name}
                </span>
                <span className="text-sm text-gray-500">
                  {formatPrice(product.price, product.id)}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stock > 10
                      ? "bg-green-100 text-green-800"
                      : product.stock > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  재고: {product.stock}개
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {/* 액션 버튼 (항상 표시) */}
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEdit(product)}
                  className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>

            {/* 아코디언 콘텐츠 */}
            {isOpen && (
              <div className="px-6 pb-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">설명</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {product.description || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      추천 상품
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {product.isRecommended ? "예" : "아니오"}
                    </p>
                  </div>
                </div>

                {/* 할인 정책 */}
                {product.discounts.length > 0 && (
                  <div className="py-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      할인 정책
                    </p>
                    <div className="space-y-1">
                      {product.discounts.map((discount, index) => (
                        <p key={index} className="text-sm text-gray-900">
                          {discount.quantity}개 이상 구매 시{" "}
                          <span className="text-indigo-600 font-medium">
                            {discount.rate * 100}% 할인
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export type { ProductWithUI };
