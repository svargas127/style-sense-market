
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="mb-6">
          <ShoppingCart size={64} className="mx-auto text-gray-300" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild size="lg" className="w-full">
          <Link to="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({totalItems})</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          {/* Header (visible on desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 py-4 text-sm font-medium text-gray-500">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>
          <Separator className="hidden md:block" />

          {/* Cart Items */}
          <div className="space-y-6 mt-6">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="grid grid-cols-12 gap-4 pb-6">
                {/* Product Image & Details */}
                <div className="col-span-12 md:col-span-6 flex gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">Size: {item.size}</p>
                    <p className="text-sm text-gray-500 mb-auto">Color: {item.product.colors[0]}</p>
                    
                    {/* Mobile Price */}
                    <div className="md:hidden text-sm mt-1">
                      ${item.product.price.toFixed(2)}
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-sm text-red-500 hover:text-red-700 flex items-center mt-2 md:mt-0"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price - Desktop */}
                <div className="hidden md:flex col-span-2 items-center justify-center">
                  ${item.product.price.toFixed(2)}
                </div>

                {/* Quantity */}
                <div className="col-span-12 md:col-span-2 flex items-center md:justify-center">
                  <div className="flex items-center border rounded">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity, -1)}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8 rounded-none"
                    >
                      <Minus size={14} />
                    </Button>
                    <div className="w-8 text-center">{item.quantity}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity, 1)}
                      disabled={item.quantity >= 10}
                      className="h-8 w-8 rounded-none"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="col-span-12 md:col-span-2 flex items-center justify-end md:text-right">
                  <div className="md:hidden font-medium mr-2">Subtotal:</div>
                  <div className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Separator between items */}
                <div className="col-span-12">
                  <Separator />
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping Button */}
          <div className="mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/products")}
              className="flex items-center"
            >
              Continue Shopping
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{totalPrice >= 50 ? "Free" : "$4.99"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${(totalPrice * 0.07).toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>
                $
                {(
                  totalPrice +
                  (totalPrice >= 50 ? 0 : 4.99) +
                  totalPrice * 0.07
                ).toFixed(2)}
              </span>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <div className="flex space-x-2">
                <Input placeholder="Promo code" className="flex-grow" />
                <Button variant="outline">Apply</Button>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>

            <div className="mt-6 text-sm text-center text-gray-500">
              <p>Secure payment with SSL encryption.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
