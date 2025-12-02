# 🎨 컴포넌트 가이드

> App.tsx에서 분리된 17개 컴포넌트에 대한 상세 문서

## 📊 개요

- **총 컴포넌트 수**: 17개
- **App.tsx 크기**: 1,581줄 → 489줄 (69% 감소)
- **폴더 구조**: common / admin / shop

---

## 🗂️ 폴더 구조

```
src/basic/components/
├── common/              # 공통 컴포넌트 (2개)
│   ├── Toast.tsx
│   └── Header.tsx
├── admin/               # 관리자 페이지 (8개)
│   ├── AdminPage.tsx
│   ├── AdminTabs.tsx
│   ├── ProductManagement.tsx
│   ├── ProductTable.tsx
│   ├── ProductForm.tsx
│   ├── CouponManagement.tsx
│   ├── CouponCard.tsx
│   └── CouponForm.tsx
└── shop/                # 쇼핑몰 페이지 (7개)
    ├── ShoppingPage.tsx
    ├── ProductList.tsx
    ├── ProductCard.tsx
    ├── CartSidebar.tsx
    ├── CartItem.tsx
    ├── CouponSelector.tsx
    └── CheckoutSummary.tsx
```

---

## 🔷 1. 공통 컴포넌트 (Common)

### 1-1. Toast

**경로**: `components/common/Toast.tsx`  
**역할**: 성공/에러/경고 알림 메시지를 화면 우측 상단에 표시

#### Props

```typescript
interface ToastProps {
  notifications: Notification[];  // 표시할 알림 배열
  onClose: (id: string) => void;  // 알림 닫기 핸들러
}

interface Notification {
  id: string;                            // 고유 ID
  message: string;                       // 알림 메시지
  type: "error" | "success" | "warning"; // 알림 타입
}
```

#### 사용 예시

```tsx
<Toast
  notifications={notifications}
  onClose={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
/>
```

#### 특징
- 자동으로 3초 후 사라짐 (부모 컴포넌트에서 타이머 관리)
- 수동 닫기 버튼 제공
- 타입별 색상 구분 (success: 초록, error: 빨강, warning: 노랑)
- 화면 우측 상단 고정 위치 (fixed positioning)

---

### 1-2. Header

**경로**: `components/common/Header.tsx`  
**역할**: 상단 헤더 바 (로고, 검색창, 관리자 전환, 장바구니 아이콘)

#### Props

```typescript
interface HeaderProps {
  isAdmin: boolean;                       // 관리자 모드 여부
  searchTerm: string;                     // 검색어
  onSearchChange: (term: string) => void; // 검색어 변경 핸들러
  onToggleAdmin: () => void;              // 관리자 모드 전환 핸들러
  cartCount: number;                      // 장바구니 아이템 개수
}
```

#### 사용 예시

```tsx
<Header
  isAdmin={isAdmin}
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  onToggleAdmin={() => setIsAdmin(!isAdmin)}
  cartCount={totalItemCount}
/>
```

#### 특징
- Sticky 헤더 (스크롤 시 상단 고정)
- 쇼핑몰 모드에서만 검색창 표시
- 장바구니 아이콘에 뱃지로 개수 표시
- 관리자/쇼핑몰 모드 토글 버튼

---

## 🔷 2. 관리자 페이지 컴포넌트 (Admin)

### 2-1. AdminPage

**경로**: `components/admin/AdminPage.tsx`  
**역할**: 관리자 대시보드의 최상위 컴포넌트 (탭 전환 및 하위 컴포넌트 조합)

#### Props

```typescript
interface AdminPageProps {
  products: ProductWithUI[];
  coupons: Coupon[];
  onAddProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  onUpdateProduct: (id: string, updates: Partial<ProductWithUI>) => void;
  onDeleteProduct: (id: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  formatPrice: (price: number, productId?: string) => string;
  addNotification: (message: string, type: "error" | "success" | "warning") => void;
}
```

#### 구성 요소
- `AdminTabs`: 상품/쿠폰 탭 전환
- `ProductManagement`: 상품 관리 섹션
- `CouponManagement`: 쿠폰 관리 섹션

#### 특징
- 탭 상태 관리 (products / coupons)
- 하위 컴포넌트에 적절한 props 전달
- 관리자 대시보드 제목 및 설명 표시

---

### 2-2. AdminTabs

**경로**: `components/admin/AdminTabs.tsx`  
**역할**: 상품 관리 / 쿠폰 관리 탭 전환 UI

#### Props

```typescript
interface AdminTabsProps {
  activeTab: "products" | "coupons";              // 현재 활성 탭
  onTabChange: (tab: "products" | "coupons") => void; // 탭 변경 핸들러
}
```

#### 특징
- 선택된 탭 강조 표시 (하단 보더)
- 호버 효과
- 접근성 고려 (button 요소 사용)

---

### 2-3. ProductManagement

**경로**: `components/admin/ProductManagement.tsx`  
**역할**: 상품 관리 섹션 (테이블 + 폼 통합)

#### Props

```typescript
interface ProductManagementProps {
  products: ProductWithUI[];
  onAdd: (product: Omit<ProductWithUI, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<ProductWithUI>) => void;
  onDelete: (id: string) => void;
  formatPrice: (price: number, productId?: string) => string;
  addNotification: (message: string, type: "error" | "success" | "warning") => void;
}
```

#### 내부 상태
- `showProductForm`: 폼 표시 여부
- `editingProduct`: 수정 중인 상품 정보

#### 구성 요소
- `ProductTable`: 상품 목록 테이블
- `ProductForm`: 상품 추가/수정 폼 (조건부 렌더링)

---

### 2-4. ProductTable

**경로**: `components/admin/ProductTable.tsx`  
**역할**: 상품 목록을 테이블 형식으로 표시

#### Props

```typescript
interface ProductTableProps {
  products: ProductWithUI[];
  onEdit: (product: ProductWithUI) => void;    // 수정 버튼 클릭
  onDelete: (id: string) => void;              // 삭제 버튼 클릭
  formatPrice: (price: number, productId?: string) => string;
}
```

#### 표시 컬럼
1. **상품명**: 제품 이름
2. **가격**: formatPrice로 포맷팅
3. **재고**: 색상 뱃지로 재고 상태 표시 (초록/노랑/빨강)
4. **설명**: 상품 설명 (없으면 "-")
5. **작업**: 수정/삭제 버튼

#### 특징
- 재고 상태별 색상 뱃지 (10개 초과: 초록, 1-10: 노랑, 0: 빨강)
- 호버 시 행 강조
- 반응형 테이블 (overflow-x-auto)

---

### 2-5. ProductForm

**경로**: `components/admin/ProductForm.tsx`  
**역할**: 상품 추가 또는 수정 폼

#### Props

```typescript
interface ProductFormProps {
  product?: ProductFormData & { id: string }; // 수정 시 기존 상품 데이터
  isEditing: boolean;                         // 수정 모드 여부
  onSubmit: (product: ProductFormData) => void;
  onCancel: () => void;
  addNotification: (message: string, type: "error" | "success" | "warning") => void;
}

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}
```

#### 폼 필드
1. **상품명** (필수)
2. **설명** (선택)
3. **가격** (필수, 숫자만 입력, 0 이상)
4. **재고** (필수, 숫자만 입력, 0-9999)
5. **할인 정책** (동적 추가/삭제)

#### 특징
- 동적 할인 정책 추가/삭제
- 입력 검증 (숫자만 허용, 범위 체크)
- onBlur 시 유효성 검사
- 빈 값 입력 시 0으로 처리

---

### 2-6. CouponManagement

**경로**: `components/admin/CouponManagement.tsx`  
**역할**: 쿠폰 관리 섹션 (카드 그리드 + 폼)

#### Props

```typescript
interface CouponManagementProps {
  coupons: Coupon[];
  onAdd: (coupon: Coupon) => void;
  onDelete: (code: string) => void;
  addNotification: (message: string, type: "error" | "success" | "warning") => void;
}
```

#### 내부 상태
- `showCouponForm`: 폼 표시 여부

#### 구성 요소
- `CouponCard`: 각 쿠폰 카드
- `CouponForm`: 쿠폰 생성 폼 (조건부 렌더링)
- 새 쿠폰 추가 버튼 (점선 테두리 카드)

---

### 2-7. CouponCard

**경로**: `components/admin/CouponCard.tsx`  
**역할**: 개별 쿠폰 정보를 카드 형식으로 표시

#### Props

```typescript
interface CouponCardProps {
  coupon: Coupon;
  onDelete: (code: string) => void;
}
```

#### 표시 정보
- 쿠폰명
- 쿠폰 코드 (monospace 폰트)
- 할인 정보 (정액/정률)
- 삭제 버튼 (우측 상단)

#### 특징
- 그라디언트 배경 (indigo → purple)
- 호버 시 삭제 버튼 색상 변경
- 할인 정보 뱃지 스타일

---

### 2-8. CouponForm

**경로**: `components/admin/CouponForm.tsx`  
**역할**: 새 쿠폰 생성 폼

#### Props

```typescript
interface CouponFormProps {
  onSubmit: (coupon: Coupon) => void;
  onCancel: () => void;
  addNotification: (message: string, type: "error" | "success" | "warning") => void;
}
```

#### 폼 필드
1. **쿠폰명** (필수)
2. **쿠폰 코드** (필수, 자동 대문자 변환)
3. **할인 타입** (정액/정률 선택)
4. **할인 값** (필수, 타입에 따라 검증)

#### 검증 규칙
- **정액 할인**: 0 ~ 100,000원
- **정률 할인**: 0 ~ 100%
- onBlur 시 자동 검증 및 제한

#### 특징
- 쿠폰 코드 자동 대문자 변환
- 할인 타입에 따라 레이블 동적 변경
- 입력값 실시간 검증

---

## 🔷 3. 쇼핑몰 페이지 컴포넌트 (Shop)

### 3-1. ShoppingPage

**경로**: `components/shop/ShoppingPage.tsx`  
**역할**: 쇼핑몰 페이지의 최상위 컴포넌트 (상품 목록 + 장바구니 레이아웃)

#### Props

```typescript
interface ShoppingPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];       // 검색 필터링된 상품
  debouncedSearchTerm: string;            // 디바운스된 검색어
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
```

#### 레이아웃
- 좌측 (3/4): `ProductList` 상품 목록
- 우측 (1/4): `CartSidebar` 장바구니

#### 특징
- 그리드 레이아웃 (lg:grid-cols-4)
- 반응형 디자인

---

### 3-2. ProductList

**경로**: `components/shop/ProductList.tsx`  
**역할**: 상품 목록을 그리드로 표시

#### Props

```typescript
interface ProductListProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  onAddToCart: (product: ProductWithUI) => void;
  getRemainingStock: (product: Product) => number;
  formatPrice: (price: number, productId?: string) => string;
}
```

#### 구성 요소
- 헤더 (제목 + 전체 상품 개수)
- `ProductCard` 그리드 (md: 2열, lg: 3열)
- 검색 결과 없음 메시지 (조건부)

#### 특징
- 반응형 그리드 (1열 → 2열 → 3열)
- 검색 결과 없을 때 안내 메시지

---

### 3-3. ProductCard

**경로**: `components/shop/ProductCard.tsx`  
**역할**: 개별 상품 카드

#### Props

```typescript
interface ProductCardProps {
  product: ProductWithUI;
  remainingStock: number;
  onAddToCart: (product: ProductWithUI) => void;
  formatPrice: (price: number, productId?: string) => string;
}
```

#### 표시 요소
1. **이미지 영역** (placeholder)
   - BEST 뱃지 (isRecommended)
   - 할인율 뱃지 (최대 할인율)
2. **상품 정보**
   - 상품명
   - 설명 (2줄 제한)
   - 가격
   - 할인 정보
3. **재고 상태**
   - 5개 이하: "품절임박!" (빨간색)
   - 5개 초과: "재고 N개" (회색)
4. **장바구니 담기 버튼**

#### 특징
- 품절 시 버튼 비활성화
- 호버 시 그림자 효과
- line-clamp로 설명 2줄 제한

---

### 3-4. CartSidebar

**경로**: `components/shop/CartSidebar.tsx`  
**역할**: 장바구니 사이드바 (sticky)

#### Props

```typescript
interface CartSidebarProps {
  cart: CartItem[];
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
  calculateItemTotal: (item: CartItem) => number;
}
```

#### 구성 요소
1. **장바구니 헤더** (아이콘 + 제목)
2. **장바구니 아이템 목록** (`CartItem`)
   - 비어있을 때: 빈 장바구니 안내
3. **쿠폰 선택** (`CouponSelector`)
4. **결제 정보** (`CheckoutSummary`)

#### 특징
- Sticky 포지셔닝 (스크롤 시 따라다님)
- 장바구니가 비어있으면 쿠폰/결제 섹션 숨김

---

### 3-5. CartItem

**경로**: `components/shop/CartItem.tsx`  
**역할**: 장바구니 개별 아이템

#### Props

```typescript
interface CartItemProps {
  item: CartItem;
  itemTotal: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}
```

#### 표시 요소
- 상품명 + 삭제 버튼
- 수량 조절 버튼 (- / + )
- 할인율 표시 (있을 경우)
- 최종 가격

#### 특징
- 할인율 자동 계산 및 표시
- 수량 변경 시 즉시 업데이트
- 최소 수량 1개 (0 이하 시 삭제)

---

### 3-6. CouponSelector

**경로**: `components/shop/CouponSelector.tsx`  
**역할**: 쿠폰 선택 드롭다운

#### Props

```typescript
interface CouponSelectorProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
}
```

#### 표시 형식
```
쿠폰명 (할인값)
예: "5000원 할인 (5,000원)"
예: "10% 할인 (10%)"
```

#### 특징
- 선택 해제 가능 ("쿠폰 선택" 옵션)
- 쿠폰 타입에 따라 표시 형식 다름
- 쿠폰 등록 버튼 (UI만, 기능 미구현)

---

### 3-7. CheckoutSummary

**경로**: `components/shop/CheckoutSummary.tsx`  
**역할**: 결제 정보 요약 및 결제 버튼

#### Props

```typescript
interface CheckoutSummaryProps {
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  onCheckout: () => void;
}
```

#### 표시 정보
1. **상품 금액**: 할인 전 가격
2. **할인 금액**: 총 할인액 (빨간색)
3. **결제 예정 금액**: 최종 금액 (강조)
4. **결제하기 버튼**: 노란색 버튼

#### 특징
- 할인이 있을 때만 할인 금액 행 표시
- 결제 버튼에 금액 표시
- 실제 결제 안내 문구

---

## 📈 컴포넌트 의존성 트리

```
App.tsx
├── Toast
├── Header
└── (isAdmin ? AdminPage : ShoppingPage)
    ├── AdminPage
    │   ├── AdminTabs
    │   ├── ProductManagement
    │   │   ├── ProductTable
    │   │   └── ProductForm
    │   └── CouponManagement
    │       ├── CouponCard (여러 개)
    │       └── CouponForm
    └── ShoppingPage
        ├── ProductList
        │   └── ProductCard (여러 개)
        └── CartSidebar
            ├── CartItem (여러 개)
            ├── CouponSelector
            └── CheckoutSummary
```

---

## 🎯 Props 전달 패턴

### 1. 이벤트 핸들러 전달
```typescript
// App.tsx에서 정의
const addProduct = (product) => { ... }

// AdminPage를 통해
<AdminPage onAddProduct={addProduct} />

// ProductManagement로 전달
<ProductManagement onAdd={onAddProduct} />

// 최종적으로 ProductForm에서 사용
<ProductForm onSubmit={onAdd} />
```

### 2. 계산 함수 전달
```typescript
// App.tsx에서 정의
const calculateItemTotal = (item) => { ... }

// ShoppingPage를 통해
<ShoppingPage calculateItemTotal={calculateItemTotal} />

// CartSidebar로 전달
<CartSidebar calculateItemTotal={calculateItemTotal} />

// CartItem에서 사용
const itemTotal = calculateItemTotal(item);
```

### 3. 상태 공유
```typescript
// App.tsx
const [selectedCoupon, setSelectedCoupon] = useState(null);

// ShoppingPage에 전달
<ShoppingPage 
  selectedCoupon={selectedCoupon}
  onApplyCoupon={(coupon) => setSelectedCoupon(coupon)}
/>

// CouponSelector와 CheckoutSummary에서 각각 사용
<CouponSelector selectedCoupon={selectedCoupon} />
<CheckoutSummary totals={totals} /> // totals는 selectedCoupon 반영
```

---

## 🔍 타입 정의 위치

### 공통 타입 (types.ts)
```typescript
- Product
- CartItem
- Coupon
```

### 컴포넌트별 확장 타입
```typescript
- ProductWithUI (ProductCard, ProductTable에서 export)
- Notification (Toast에서 export)
- ProductFormData (ProductForm에서 export)
```

---

## 🚀 사용 가이드

### 새 컴포넌트 추가하기

1. **적절한 폴더 선택**
   - 공통: `components/common/`
   - 관리자: `components/admin/`
   - 쇼핑몰: `components/shop/`

2. **컴포넌트 생성**
   ```tsx
   interface MyComponentProps {
     // props 정의
   }
   
   export const MyComponent: React.FC<MyComponentProps> = (props) => {
     // 구현
   }
   ```

3. **부모 컴포넌트에서 import**
   ```tsx
   import { MyComponent } from './MyComponent';
   ```

### 컴포넌트 수정하기

1. **Props 변경 시**
   - Props interface 수정
   - 부모 컴포넌트에서 전달하는 props 확인
   - 타입 에러 수정

2. **UI 변경 시**
   - JSX만 수정
   - Props와 로직은 유지

3. **로직 추가 시**
   - 가능하면 부모에서 로직 처리
   - 컴포넌트는 UI 중심으로 유지

---

## ⚠️ 주의사항

### Props Drilling 주의
현재 일부 props가 3단계 이상 전달됨:
```
App → ShoppingPage → CartSidebar → CartItem
```

**해결 방안**:
- Context API 사용
- 상태 관리 라이브러리 (Zustand, Recoil 등)

### 재사용성 고려
- 컴포넌트는 특정 비즈니스 로직에 의존하지 않도록
- Props로 필요한 데이터와 함수를 받도록
- 스타일은 props로 커스터마이징 가능하게

### 성능 최적화
- `React.memo`로 불필요한 리렌더링 방지
- `useMemo`, `useCallback` 활용
- 큰 리스트는 가상화 고려

---

## 📝 다음 단계

### 1. 비즈니스 로직 분리
현재 App.tsx에 있는 로직을:
- `hooks/useCart.ts`
- `hooks/useProducts.ts`
- `hooks/useCoupons.ts`
- `models/discount.ts`

로 이동 (이미 파일 존재 확인됨)

### 2. 테스트 작성
각 컴포넌트별 테스트:
```
__tests__/
├── common/
│   ├── Toast.test.tsx
│   └── Header.test.tsx
├── admin/
│   └── ...
└── shop/
    └── ...
```

### 3. Storybook 추가
컴포넌트 카탈로그 및 문서화

### 4. 아이콘 컴포넌트 분리
반복되는 SVG 아이콘들을 별도 컴포넌트로

---

**작성일**: 2025-12-02  
**버전**: 1.0.0  
**작성자**: AI Assistant

