import { useState, useEffect } from "react";
import { Product, CartItem, CheckoutPayload, Receipt } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Cart } from "@/components/Cart";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckoutModal } from "@/components/CheckOutModel";
import { ReceiptModal } from "@/components/ReceiptModel";
import React from "react";
import { getProducts } from "@/lib/api";

const Index: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [receiptOpen, setReceiptOpen] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const { toast } = useToast();

  const {
    cartItems,
    total,
    loading: cartLoading,
    addToCart,
    updateQuantity,
    removeItem,
    checkout,
  } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoadingProducts(true);
      const res = await getProducts();

      if (res.success) {
        setProducts((res as unknown as { products: Product[] }).products);
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to load products",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCheckout = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleCheckoutSubmit = async (data: CheckoutPayload): Promise<void> => {
    try {
      await checkout(data);
      setCheckoutOpen(false);
      setReceiptOpen(true);
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Vibe Commerce</h1>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setCartOpen(true)}
            className="relative"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Cart
            {cartItems.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>
      </header>

      <section className="border-b bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-5xl font-bold">Welcome to Vibe Commerce</h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Discover amazing tech products at unbeatable prices. Shop now and
            elevate your lifestyle!
          </p>
        </div>
      </section>

      <section className="container py-12">
        <h3 className="mb-8 text-3xl font-bold">Featured Products</h3>
        {loadingProducts ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                loading={cartLoading}
              />
            ))}
          </div>
        )}
      </section>

      <Cart
        open={cartOpen}
        onOpenChange={setCartOpen}
        cartItems={cartItems}
        total={total}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
        loading={cartLoading}
      />

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onSubmit={handleCheckoutSubmit}
        loading={cartLoading}
      />

      <ReceiptModal
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        receipt={receipt}
      />
    </div>
  );
};

export default Index;
