export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

export interface CheckoutPayload {
  name: string;
  email: string;
}

export interface ReceiptItem {
  quantity: number;
  products: {
    name: string;
    price: string;
  };
}

export interface Receipt {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: ReceiptItem[];
  total: string;
  timestamp: string;
  message: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type UpdateQuantityFn = (cartItemId: string, quantity: number) => void;
export type RemoveItemFn = (cartItemId: string) => void;
export type CheckoutFn = (
  data: CheckoutPayload
) => Promise<{ receipt: Receipt }>;
