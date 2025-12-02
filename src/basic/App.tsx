import { useState, useMemo } from "react";
import { Toast } from "./components/common/Toast";
import { Header } from "./components/common/Header";
import { AdminPage } from "./components/admin/AdminPage";
import { ShoppingPage } from "./components/shop/ShoppingPage";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { useCoupons } from "./hooks/useCoupons";
import { useNotification } from "./hooks/useNotification";
import { useDebounce } from "./utils/hooks/useDebounce";
import { formatPrice } from "./utils/formatters";
import { calculateItemTotal } from "./models/discount";

const App = () => {
  // ==========================================
  // 🔷 커스텀 훅으로 비즈니스 로직 분리
  // ==========================================
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    getRemainingStock,
    clearCart,
    setSelectedCoupon,
  } = useCart();
  const { coupons, addCoupon, deleteCoupon } = useCoupons();
  const { notifications, addNotification, removeNotification } =
    useNotification();

  // ==========================================
  // 🔷 UI 상태
  // ==========================================
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // ==========================================
  // 🔷 계산된 값 (useMemo로 최적화)
  // ==========================================
  const totals = useMemo(() => calculateTotal(), [calculateTotal]);

  const totalItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const filteredProducts = useMemo(
    () =>
      debouncedSearchTerm
        ? products.filter(
            (product) =>
              product.name
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              (product.description &&
                product.description
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase()))
          )
        : products,
    [products, debouncedSearchTerm]
  );

  // ==========================================
  // 🔷 이벤트 핸들러
  // ==========================================
  const handleAddToCart = (product: any) => {
    const result = addToCart(product);
    addNotification(result.message, result.success ? "success" : "error");
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const result = updateQuantity(productId, newQuantity, product.stock);
    if (!result.success && result.message) {
      addNotification(result.message, "error");
    }
  };

  const handleApplyCoupon = (coupon: any) => {
    if (!coupon) {
      setSelectedCoupon(null);
      return;
    }

    const result = applyCoupon(coupon);
    addNotification(result.message, result.success ? "success" : "error");
  };

  const handleCheckout = () => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    clearCart();
  };

  const handleAddProduct = (product: any) => {
    const result = addProduct(product);
    addNotification(result.message, "success");
  };

  const handleUpdateProduct = (id: string, updates: any) => {
    const result = updateProduct(id, updates);
    addNotification(result.message, "success");
  };

  const handleDeleteProduct = (id: string) => {
    const result = deleteProduct(id);
    addNotification(result.message, "success");
  };

  const handleAddCoupon = (coupon: any) => {
    const result = addCoupon(coupon);
    addNotification(result.message, result.success ? "success" : "error");
  };

  const handleDeleteCoupon = (code: string) => {
    const result = deleteCoupon(code);
    if (selectedCoupon?.code === code) {
      setSelectedCoupon(null);
    }
    addNotification(result.message, "success");
  };

  const handleFormatPrice = (price: number, productId?: string) => {
    const product = productId
      ? products.find((p) => p.id === productId)
      : undefined;
    return formatPrice(price, {
      isAdmin,
      product,
      cart,
    });
  };

  const handleCalculateItemTotal = (item: any) => {
    return calculateItemTotal(item, cart);
  };

  // ==========================================
  // 🔷 JSX 렌더링
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50">
      <Toast notifications={notifications} onClose={removeNotification} />

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        cartCount={totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCoupon={handleAddCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            formatPrice={handleFormatPrice}
            addNotification={addNotification}
          />
        ) : (
          <ShoppingPage
            products={products}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            totals={totals}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onApplyCoupon={handleApplyCoupon}
            onCheckout={handleCheckout}
            getRemainingStock={getRemainingStock}
            calculateItemTotal={handleCalculateItemTotal}
            formatPrice={handleFormatPrice}
          />
        )}
      </main>
    </div>
  );
};

export default App;
