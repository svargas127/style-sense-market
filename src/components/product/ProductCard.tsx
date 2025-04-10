
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="relative overflow-hidden rounded-md product-card-hover">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-black text-white">New</Badge>
          )}
          {product.isSale && (
            <Badge className="bg-red-500 text-white">
              {product.discount}% Off
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-3">
          <h3 className="font-medium text-sm">{product.name}</h3>
          <div className="flex items-center mt-1">
            {product.isSale ? (
              <div className="flex items-center">
                <span className="text-gray-500 line-through mr-2">${product.price.toFixed(2)}</span>
                <span className="font-medium text-red-500">
                  ${(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-medium">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="mt-1 flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm">
                  {i < Math.floor(product.rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
