import { useState } from "react";
import { ProductTable, ProductWithUI } from "./ProductTable";
import { ProductForm, ProductFormData } from "./ProductForm";

interface ProductManagementProps {
  products: ProductWithUI[];
  onAdd: (product: Omit<ProductWithUI, "id">) => void;
  onUpdate: (id: string, updates: Partial<ProductWithUI>) => void;
  onDelete: (id: string) => void;
  formatPrice: (price: number, productId?: string) => string;
  addNotification: (message: string, type: "error" | "success" | "warning") => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  onAdd,
  onUpdate,
  onDelete,
  formatPrice,
  addNotification,
}) => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithUI | null>(null);

  const handleEdit = (product: ProductWithUI) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSubmit = (formData: ProductFormData) => {
    if (editingProduct) {
      onUpdate(editingProduct.id, formData);
    } else {
      onAdd(formData);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleCancel = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={handleNewProduct}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={onDelete}
        formatPrice={formatPrice}
      />

      {showProductForm && (
        <ProductForm
          product={
            editingProduct
              ? {
                  id: editingProduct.id,
                  name: editingProduct.name,
                  price: editingProduct.price,
                  stock: editingProduct.stock,
                  description: editingProduct.description || "",
                  discounts: editingProduct.discounts || [],
                }
              : undefined
          }
          isEditing={!!editingProduct}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          addNotification={addNotification}
        />
      )}
    </section>
  );
};

