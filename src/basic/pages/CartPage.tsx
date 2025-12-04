import { Toast } from "../components/common/Toast";
import { ProductList } from "../components/cart/ProductList";
import { CartSidebar } from "../components/cart/CartSidebar";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { useCoupons } from "../hooks/useCoupons";
import { useNotification } from "../hooks/useNotification";

interface CartPageProps {
  searchTerm: string;
}

export const CartPage: React.FC<CartPageProps> = ({ searchTerm }) => {
  // 알림 훅
  const { notifications, addNotification, removeNotification } =
    useNotification();

  // 상품 관리 훅
  const { products, filteredProducts, debouncedSearchTerm, getFormattedPrice } =
    useProducts(searchTerm, addNotification, false);

  // 장바구니 관리 훅
  const {
    cart,
    selectedCoupon,
    calculateTotal,
    getItemTotal,
    getItemDiscountRate,
    getRemainingStock,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCart,
  } = useCart(products, addNotification);

  // 총액 계산
  const totals = calculateTotal();

  // 쿠폰 훅 (쿠폰 목록만 사용)
  const { coupons } = useCoupons(addNotification);

  // 가격 포맷팅
  const formatPrice = (price: number, productId?: string) =>
    getFormattedPrice(price, productId, cart);

  return (
    <>
      <Toast notifications={notifications} onClose={removeNotification} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ProductList
            products={products}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            onAddToCart={addToCart}
            getRemainingStock={getRemainingStock}
            formatPrice={formatPrice}
          />
        </div>

        <div className="lg:col-span-1">
          <CartSidebar
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            totals={totals}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onApplyCoupon={applyCoupon}
            onCheckout={clearCart}
            calculateItemTotal={getItemTotal}
            calculateItemDiscountRate={getItemDiscountRate}
          />
        </div>
      </div>
    </>
  );
};
