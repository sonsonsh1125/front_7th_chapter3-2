import { useState } from "react";
import { Coupon } from "../../../types";
import { ProductWithUI } from "./ProductTable";
import { AdminTabs } from "./AdminTabs";
import { ProductManagement } from "./ProductManagement";
import { CouponManagement } from "./CouponManagement";

interface AdminPageProps {
  products: ProductWithUI[];
  coupons: Coupon[];
  onAddProduct: (product: Omit<ProductWithUI, "id">) => void;
  onUpdateProduct: (id: string, updates: Partial<ProductWithUI>) => void;
  onDeleteProduct: (id: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  formatPrice: (price: number, productId?: string) => string;
  addNotification: (message: string, type: "error" | "success" | "warning") => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  coupons,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCoupon,
  onDeleteCoupon,
  formatPrice,
  addNotification,
}) => {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "products" ? (
        <ProductManagement
          products={products}
          onAdd={onAddProduct}
          onUpdate={onUpdateProduct}
          onDelete={onDeleteProduct}
          formatPrice={formatPrice}
          addNotification={addNotification}
        />
      ) : (
        <CouponManagement
          coupons={coupons}
          onAdd={onAddCoupon}
          onDelete={onDeleteCoupon}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};

