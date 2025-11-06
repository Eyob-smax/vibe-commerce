import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import { CartItem } from "@/lib/types";

const getSessionId = () => {
  let sessionId = localStorage.getItem("cart_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;
    localStorage.setItem("cart_session_id", sessionId);
  }
  return sessionId;
};

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const sessionId = getSessionId();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const result = await apiGet<CartItem[]>(`/cart?sessionId=${sessionId}`);
      console.log("Fetch cart result:", result);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch cart");
      }
      setCartItems(
        (result as unknown as { cartItems: CartItem[] }).cartItems || []
      );
      setTotal(
        (result as unknown as { cartItems: CartItem[] }).cartItems.reduce(
          (acc, item) => acc + item.product.price * item.product.stock,
          0
        )
      );
    } catch (error) {
      console.error("Fetch cart error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      setLoading(true);
      const result = await apiPost("/cart", {
        sessionId,
        productId,
        quantity: 1,
      });
      if (!result.success) {
        throw new Error(result.message || "Failed to add item");
      }

      await fetchCart();
      toast({
        title: "Success",
        description: "Item added to cart",
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setLoading(true);
      const result = await apiPatch(`/cart/${cartItemId}`, {
        quantity,
      });
      if (!result.success) {
        throw new Error(result.message || "Failed to update quantity");
      }
      await fetchCart();
    } catch (error) {
      console.error("Update quantity error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      setLoading(true);
      const { success, message } = await apiDelete(`/cart/${cartItemId}`);
      if (!success) {
        throw new Error(message || "Failed to remove item");
      }
      await fetchCart();
      toast({
        title: "Success",
        description: "Item removed",
      });
    } catch (error) {
      console.error("Remove item error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkout = async (customerData: { name: string; email: string }) => {
    try {
      setLoading(true);
      const result = await apiPost("/checkout", {
        name: customerData.name,
        email: customerData.email,
        sessionId,
      });
      if (!result.success) {
        throw new Error(result.message || "Failed to checkout");
      }
      toast({
        title: "Success",
        description: "Checkout completed",
      });
      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: error.message || "Checkout failed",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cartItems,
    total,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    checkout,
  };
};
