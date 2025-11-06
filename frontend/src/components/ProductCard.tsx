import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  loading?: boolean;
}

export const ProductCard = ({
  product,
  onAddToCart,
  loading,
}: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-primary">${product.price}</p>
          <p className="text-sm text-muted-foreground">
            Stock: {product.stock}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onAddToCart(product.id)}
          disabled={loading || product.stock === 0}
          className="w-full"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};
