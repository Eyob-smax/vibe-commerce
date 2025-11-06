import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ReceiptItem {
  quantity: number;
  products: {
    name: string;
    price: string;
  };
}

interface Receipt {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: ReceiptItem[];
  total: string;
  timestamp: string;
  message: string;
}

interface ReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: Receipt | null;
}

export const ReceiptModal = ({
  open,
  onOpenChange,
  receipt,
}: ReceiptModalProps) => {
  if (!receipt) return null;

  const date = new Date(receipt.timestamp).toLocaleString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">{receipt.message}</DialogTitle>
          <DialogDescription className="text-center">
            Order #{receipt.orderId.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm text-muted-foreground">Customer Details</p>
            <p className="font-semibold">{receipt.customerName}</p>
            <p className="text-sm">{receipt.customerEmail}</p>
          </div>

          <Separator />

          <div>
            <p className="mb-2 text-sm font-semibold">Order Items</p>
            <div className="space-y-2">
              {receipt.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.products.name}
                  </span>
                  <span className="font-semibold">
                    $
                    {(parseFloat(item.products.price) * item.quantity).toFixed(
                      2
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-primary">
              ${receipt.total}
            </span>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Order placed on {date}
          </p>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Continue Shopping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
