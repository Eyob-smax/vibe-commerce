// src/lib/api.ts
import type { ApiResponse, Product, CartItem, Receipt } from "@/lib/types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API request failed");
  }
  return response.json();
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<T>(response);
}

export async function apiPost<T, B extends object>(
  path: string,
  body: B
): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

export async function apiPatch<T, B extends object>(
  path: string,
  body: B
): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

export async function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<T>(response);
}

export function getProducts() {
  return apiGet<Product[]>("/products");
}

export function addProduct(body: {
  title: string;
  description: string;
  price: number;
  image: string;
}) {
  return apiPost<Product, typeof body>("/products", body);
}

export function getCart() {
  return apiGet<CartItem[]>("/cart");
}

export function addToCart(body: { productId: number; quantity: number }) {
  return apiPost<CartItem[], typeof body>("/cart/add", body);
}

export function updateCartItem(body: { cartItemId: number; quantity: number }) {
  return apiPatch<CartItem[], typeof body>("/cart/update", body);
}

export function removeCartItem(cartItemId: number) {
  return apiDelete<CartItem[]>(`/cart/remove/${cartItemId}`);
}

export function checkoutCart(body: {
  customerName: string;
  customerEmail: string;
}) {
  return apiPost<Receipt, typeof body>("/cart/checkout", body);
}
