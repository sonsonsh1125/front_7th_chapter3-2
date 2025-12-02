import { CartItem as CartItemType, Coupon } from "../../../types";
import { CartItem } from "./CartItem";
import { CouponSelector } from "./CouponSelector";
import { CheckoutSummary } from "./CheckoutSummary";

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
}) => {
  return (
    <div className="sticky top-24 space-y-4">
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          장바구니
        </h2>
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => {
              const itemTotal = calculateItemTotal(item);
              return (
                <CartItem
                  key={item.product.id}
                  item={item}
                  itemTotal={itemTotal}
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

