import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CartItem, UpdateQuantityFn, RemoveItemFn } from "@/lib/types";
import React from "react";

interface CartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  total: number;
  onUpdateQuantity: UpdateQuantityFn;
  onRemoveItem: RemoveItemFn;
  onCheckout: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loading?: boolean;
}

export const Cart = ({
  open,
  onOpenChange,
  cartItems,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  loading,
}: CartProps) => {
  const isEmpty = cartItems.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
          </SheetTitle>
          <SheetDescription>
            {isEmpty
              ? "Your cart is empty"
              : `${cartItems.length} item${
                  cartItems.length > 1 ? "s" : ""
                } in cart`}
          </SheetDescription>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                Start shopping to add items
              </p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 py-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <p className="text-sm font-bold text-primary">
                          ${item.product.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={loading}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={loading}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto h-8 w-8"
                          onClick={() => onRemoveItem(item.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            <SheetFooter className="flex-col gap-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-2xl text-primary">${total}</span>
              </div>
              <Button
                onClick={onCheckout}
                size="lg"
                className="w-full"
                disabled={loading}
              >
                Proceed to Checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
