import { CartItem as CartItemType, Coupon } from "../../../types";
import { CartItem } from "./CartItem";
import { CouponSelector } from "./CouponSelector";
import { CheckoutSummary } from "./CheckoutSummary";
import { ShoppingBagIcon, ShoppingBagEmptyIcon } from "../icons";

interface CartSidebarProps {
  cart: CartItemType[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon | null) => void;
  onCheckout: () => void;
  calculateItemTotal: (item: CartItemType) => number;
  calculateItemDiscountRate: (item: CartItemType) => number;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  coupons,
  selectedCoupon,
  totals,
  onRemove,
  onUpdateQuantity,
  onApplyCoupon,
  onCheckout,
  calculateItemTotal,
  calculateItemDiscountRate,
}) => {
  return (
    <div className="sticky top-24 space-y-4">
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <ShoppingBagIcon className="w-5 h-5 mr-2" />
          장바구니
        </h2>
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBagEmptyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => {
              const itemTotal = calculateItemTotal(item);
              const discountRate = calculateItemDiscountRate(item);
              return (
                <CartItem
                  key={item.product.id}
                  item={item}
                  itemTotal={itemTotal}
                  discountRate={discountRate}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                />
              );
            })}
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <>
          <CouponSelector
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            onApplyCoupon={onApplyCoupon}
          />
          <CheckoutSummary totals={totals} onCheckout={onCheckout} />
        </>
      )}
    </div>
  );
};
