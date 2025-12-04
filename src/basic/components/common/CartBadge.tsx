import { CartItem } from "../../../types";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { CartIcon } from "../icons";

export const CartBadge: React.FC = () => {
  // localStorage에서 cart를 읽어와서 개수 계산
  const [cart] = useLocalStorage<CartItem[]>("cart", []);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative">
      <CartIcon className="w-6 h-6 text-gray-700" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </div>
  );
};


