import { CartItem, Coupon, Product } from "../../../types";
import { ProductWithUI } from "./ProductCard";
import { ProductList } from "./ProductList";
import { CartSidebar } from "./CartSidebar";

interface ShoppingPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  onAddToCart: (product: ProductWithUI) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon | null) => void;
  onCheckout: () => void;
  getRemainingStock: (product: Product) => number;
  calculateItemTotal: (item: CartItem) => number;
  formatPrice: (price: number, productId?: string) => string;
}

export const ShoppingPage: React.FC<ShoppingPageProps> = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  cart,
  coupons,
  selectedCoupon,
  totals,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onCheckout,
  getRemainingStock,
  calculateItemTotal,
  formatPrice,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          onAddToCart={onAddToCart}
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
          onRemove={onRemoveFromCart}
          onUpdateQuantity={onUpdateQuantity}
          onApplyCoupon={onApplyCoupon}
          onCheckout={onCheckout}
          calculateItemTotal={calculateItemTotal}
        />
      </div>
    </div>
  );
};

