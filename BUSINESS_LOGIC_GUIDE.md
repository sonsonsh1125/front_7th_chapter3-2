# 🧮 비즈니스 로직 분리 가이드

> App.tsx에서 비즈니스 로직을 hooks와 models로 분리한 문서

## 📊 개요

- **App.tsx 크기**: 1,581줄 → 489줄 → **201줄** (87% 감소)
- **분리된 hooks**: 4개
- **분리된 models**: 2개
- **분리된 utils**: 3개

---

## 🗂️ 전체 구조

```
src/basic/
├── App.tsx (201줄)          # UI 조합 및 이벤트 핸들링
├── components/ (17개)        # UI 컴포넌트
├── hooks/ (4개)              # 상태 관리 hooks
├── models/ (2개)             # 순수 비즈니스 로직
├── utils/                    # 유틸리티 함수
│   ├── formatters.ts
│   └── hooks/
│       ├── useDebounce.ts
│       └── useLocalStorage.ts
└── constants/                # 상수 및 초기 데이터
    └── index.ts
```

---

## 🔷 1. Constants (상수)

### constants/index.ts

**역할**: 타입 정의 및 초기 데이터

#### 내보내는 항목

```typescript
// 타입
export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

// 초기 데이터
export const initialProducts: ProductWithUI[]
export const initialCoupons: Coupon[]
```

#### 특징
- 앱 전체에서 사용되는 타입 정의
- 하드코딩된 초기 데이터
- 변경되지 않는 상수값

---

## 🔷 2. Models (비즈니스 로직)

### 2-1. models/discount.ts

**역할**: 할인 계산 로직 (순수 함수)

#### 함수 목록

##### `getMaxApplicableDiscount(item, cart)`
장바구니 아이템에 적용 가능한 최대 할인율 계산

```typescript
/**
 * @param item - 장바구니 아이템
 * @param cart - 전체 장바구니 (대량 구매 체크용)
 * @returns 최대 할인율 (0~0.5)
 */
```

**로직**:
1. 상품의 할인 정책에서 수량 조건 충족하는 최대 할인율 찾기
2. 10개 이상 대량 구매 시 5% 추가 할인 (최대 50%)

##### `calculateItemTotal(item, cart)`
개별 장바구니 아이템의 최종 가격 계산

```typescript
/**
 * @param item - 장바구니 아이템
 * @param cart - 전체 장바구니
 * @returns 할인이 적용된 최종 금액
 */
```

**특징**:
- 순수 함수 (side effect 없음)
- 테스트하기 쉬움
- 재사용 가능

---

### 2-2. models/cart.ts

**역할**: 장바구니 관련 계산 및 로직 (순수 함수)

#### 함수 목록

##### `calculateCartTotal(cart, selectedCoupon)`
장바구니의 총 금액 계산

```typescript
/**
 * @returns { totalBeforeDiscount, totalAfterDiscount }
 */
```

**로직**:
1. 각 아이템의 할인 전/후 금액 합산
2. 쿠폰 할인 적용 (정액/정률)

##### `getRemainingStock(product, cart)`
상품의 남은 재고 계산

```typescript
/**
 * @returns 남은 재고 수량
 */
```

##### `addItemToCart(cart, product)`
장바구니에 아이템 추가

```typescript
/**
 * @returns { cart, success, message }
 */
```

**검증**:
- 재고 확인
- 수량 제한 체크

##### `removeItemFromCart(cart, productId)`
장바구니에서 아이템 제거

##### `updateCartItemQuantity(cart, productId, newQuantity, maxStock)`
장바구니 아이템 수량 업데이트

**특징**:
- 불변성 유지 (새 배열 반환)
- 에러 메시지 포함
- 순수 함수로 테스트 용이

---

## 🔷 3. Utils (유틸리티)

### 3-1. utils/formatters.ts

**역할**: 데이터 포맷팅

#### `formatPrice(price, options)`

```typescript
/**
 * @param price - 포매팅할 가격
 * @param options - { isAdmin?, product?, cart? }
 * @returns 포매팅된 가격 문자열
 */
```

**로직**:
- 재고 0 → "SOLD OUT"
- 관리자 → "10,000원"
- 일반 → "₩10,000"

---

### 3-2. utils/hooks/useDebounce.ts

**역할**: 값 변경 디바운싱

```typescript
/**
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (밀리초)
 * @returns 디바운스된 값
 */
export function useDebounce<T>(value: T, delay: number): T
```

**사용 예시**:
```tsx
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce(searchTerm, 500);
// 입력 후 500ms 후에 검색 실행
```

---

### 3-3. utils/hooks/useLocalStorage.ts

**역할**: localStorage와 동기화되는 상태 관리

```typescript
/**
 * @param key - localStorage 키
 * @param initialValue - 초기값
 * @returns [값, 설정 함수]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void]
```

**특징**:
- 초기 로드 시 localStorage에서 값 읽기
- 값 변경 시 자동으로 localStorage에 저장
- 빈 배열이나 null은 자동 삭제

**사용 예시**:
```tsx
const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
// cart가 변경되면 자동으로 localStorage에 저장됨
```

---

## 🔷 4. Hooks (상태 관리)

### 4-1. hooks/useNotification.ts

**역할**: 알림(Toast) 관리

#### 반환값

```typescript
{
  notifications: Notification[],
  addNotification: (message, type) => void,
  removeNotification: (id) => void,
}
```

#### 특징
- 알림 추가 시 자동으로 3초 후 제거
- 수동 제거 가능

#### 사용 예시

```tsx
const { notifications, addNotification } = useNotification();

addNotification("장바구니에 담았습니다", "success");
addNotification("재고가 부족합니다", "error");
```

---

### 4-2. hooks/useProducts.ts

**역할**: 상품 상태 및 CRUD

#### 반환값

```typescript
{
  products: ProductWithUI[],
  addProduct: (product) => { success, message },
  updateProduct: (id, updates) => { success, message },
  deleteProduct: (id) => { success, message },
}
```

#### 내부 구현
- `useLocalStorage`로 자동 저장
- ID 자동 생성 (`p${Date.now()}`)

#### 사용 예시

```tsx
const { products, addProduct, updateProduct, deleteProduct } = useProducts();

const handleAdd = () => {
  const result = addProduct({ name: "새 상품", price: 10000, ... });
  if (result.success) {
    showMessage(result.message);
  }
};
```

---

### 4-3. hooks/useCoupons.ts

**역할**: 쿠폰 상태 및 CRUD

#### 반환값

```typescript
{
  coupons: Coupon[],
  addCoupon: (coupon) => { success, message },
  deleteCoupon: (code) => { success, message },
}
```

#### 검증
- 중복 코드 체크

#### 사용 예시

```tsx
const { coupons, addCoupon, deleteCoupon } = useCoupons();

const result = addCoupon({ 
  name: "신규 쿠폰", 
  code: "NEW2024", 
  ... 
});
```

---

### 4-4. hooks/useCart.ts

**역할**: 장바구니 상태 및 모든 장바구니 액션

#### 반환값

```typescript
{
  cart: CartItem[],
  selectedCoupon: Coupon | null,
  addToCart: (product) => { success, message },
  removeFromCart: (productId) => void,
  updateQuantity: (productId, quantity, maxStock) => { success, message? },
  applyCoupon: (coupon) => { success, message },
  calculateTotal: () => { totalBeforeDiscount, totalAfterDiscount },
  getRemainingStock: (product) => number,
  clearCart: () => void,
  setSelectedCoupon: (coupon) => void,
}
```

#### 내부 구현
- `useLocalStorage`로 자동 저장
- `models/cart.ts`의 순수 함수 활용
- 쿠폰 적용 검증 (10,000원 이상)

#### 사용 예시

```tsx
const {
  cart,
  selectedCoupon,
  addToCart,
  calculateTotal,
  applyCoupon,
} = useCart();

const handleAddToCart = (product) => {
  const result = addToCart(product);
  showMessage(result.message, result.success ? "success" : "error");
};

const totals = calculateTotal();
// { totalBeforeDiscount: 30000, totalAfterDiscount: 25000 }
```

---

## 🎯 App.tsx의 역할

리팩토링 후 App.tsx는 다음만 담당합니다:

### 1. Hooks 조합
```tsx
const { products, addProduct } = useProducts();
const { cart, addToCart } = useCart();
const { notifications, addNotification } = useNotification();
```

### 2. UI 상태 관리
```tsx
const [isAdmin, setIsAdmin] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
```

### 3. 이벤트 핸들러
```tsx
const handleAddToCart = (product) => {
  const result = addToCart(product);
  addNotification(result.message, result.success ? "success" : "error");
};
```

### 4. 컴포넌트 조합
```tsx
return (
  <div>
    <Toast notifications={notifications} />
    <Header isAdmin={isAdmin} />
    {isAdmin ? <AdminPage /> : <ShoppingPage />}
  </div>
);
```

---

## 📈 개선 효과

### Before (리팩토링 전)

```tsx
// App.tsx 1,581줄
const App = () => {
  // 200줄의 상태 선언
  const [products, setProducts] = useState(...);
  const [cart, setCart] = useState(...);
  // ...
  
  // 300줄의 비즈니스 로직
  const calculateTotal = () => { ... };
  const addToCart = () => { ... };
  // ...
  
  // 1000줄의 JSX
  return <div>...</div>;
};
```

**문제점**:
- ❌ 테스트 어려움
- ❌ 재사용 불가능
- ❌ 유지보수 어려움
- ❌ 책임 혼재

---

### After (리팩토링 후)

```tsx
// App.tsx 201줄
const App = () => {
  // hooks로 비즈니스 로직 분리
  const { products, addProduct } = useProducts();
  const { cart, addToCart } = useCart();
  const { notifications, addNotification } = useNotification();
  
  // UI 상태만 관리
  const [isAdmin, setIsAdmin] = useState(false);
  
  // 이벤트 핸들러 (hooks 조합)
  const handleAddToCart = (product) => {
    const result = addToCart(product);
    addNotification(result.message);
  };
  
  // 컴포넌트 조합
  return (
    <div>
      <Toast />
      <Header />
      {isAdmin ? <AdminPage /> : <ShoppingPage />}
    </div>
  );
};
```

**개선점**:
- ✅ 테스트 가능 (hooks와 models 독립 테스트)
- ✅ 재사용 가능 (hooks 다른 곳에서도 사용)
- ✅ 유지보수 용이 (책임 분리)
- ✅ 명확한 책임

---

## 🧪 테스트 전략

### Models 테스트 (순수 함수)
```typescript
// models/discount.test.ts
describe('getMaxApplicableDiscount', () => {
  it('10개 이상 구매 시 대량 할인 적용', () => {
    const item = { product: { discounts: [{ quantity: 10, rate: 0.1 }] }, quantity: 10 };
    const cart = [item];
    expect(getMaxApplicableDiscount(item, cart)).toBe(0.15); // 0.1 + 0.05
  });
});
```

### Hooks 테스트
```typescript
// hooks/useCart.test.ts
import { renderHook, act } from '@testing-library/react-hooks';

describe('useCart', () => {
  it('장바구니에 상품 추가', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      const res = result.current.addToCart(mockProduct);
      expect(res.success).toBe(true);
    });
    
    expect(result.current.cart).toHaveLength(1);
  });
});
```

---

## 📋 디렉토리별 책임

| 디렉토리 | 책임 | 상태 | Side Effect |
|----------|------|------|-------------|
| **models/** | 비즈니스 로직 | ❌ | ❌ |
| **utils/** | 유틸리티 | ❌ | ❌ |
| **hooks/** | 상태 관리 | ✅ | ✅ |
| **components/** | UI 렌더링 | ❌ | ❌ |
| **App.tsx** | 조합 및 라우팅 | ✅ (UI만) | ✅ |

---

## 🚀 다음 단계

### 1. Props Drilling 해결
현재 일부 props가 3-4단계 전달됨. 해결 방안:
- Context API
- Zustand
- Jotai

### 2. 추가 최적화
- `useMemo`로 계산 결과 캐싱
- `useCallback`로 함수 메모이제이션
- React.memo로 컴포넌트 최적화

### 3. 테스트 코드 작성
- 각 hook별 테스트
- 각 model 함수별 테스트
- 통합 테스트

---

**작성일**: 2025-12-02  
**버전**: 2.0.0  
**작성자**: AI Assistant

