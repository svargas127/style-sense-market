
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCheck, CreditCard, Shield } from "lucide-react";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      email: user?.email || "",
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
      country: "United States",
    },
  });

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const calculateTax = () => totalPrice * 0.07;
  const calculateShipping = () => {
    if (totalPrice >= 50) return 0;
    return shippingMethod === "express" ? 12.99 : 4.99;
  };

  const calculateTotal = () => totalPrice + calculateTax() + calculateShipping();

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsProcessing(true);
      
      // This would be an API call in a real app
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Success!
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for shopping with us. Your order is being processed.",
      });
      navigate("/profile");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Progress Steps */}
            <div className="relative mb-8 px-4">
              <div className="flex justify-between w-full mb-2">
                <div 
                  className={`z-10 relative flex flex-col items-center ${
                    step >= 1 ? "text-primary" : "text-gray-400"
                  }`}
                >
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center border ${
                    step >= 1 ? "bg-primary text-white border-primary" : "bg-gray-100 border-gray-300"
                  }`}>
                    {step > 1 ? <CheckCheck size={16} /> : 1}
                  </div>
                  <span className="text-xs mt-1">Shipping</span>
                </div>
                <div 
                  className={`z-10 relative flex flex-col items-center ${
                    step >= 2 ? "text-primary" : "text-gray-400"
                  }`}
                >
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center border ${
                    step >= 2 ? "bg-primary text-white border-primary" : "bg-gray-100 border-gray-300"
                  }`}>
                    {step > 2 ? <CheckCheck size={16} /> : 2}
                  </div>
                  <span className="text-xs mt-1">Delivery</span>
                </div>
                <div 
                  className={`z-10 relative flex flex-col items-center ${
                    step >= 3 ? "text-primary" : "text-gray-400"
                  }`}
                >
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center border ${
                    step >= 3 ? "bg-primary text-white border-primary" : "bg-gray-100 border-gray-300"
                  }`}>
                    3
                  </div>
                  <span className="text-xs mt-1">Payment</span>
                </div>
              </div>
              <div className="absolute top-4 h-px bg-gray-300 w-full"></div>
            </div>
            
            {/* Step 1: Contact & Shipping Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        {...register("email", { required: "Email is required" })}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...register("phone", { required: "Phone is required" })}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          {...register("firstName", { required: "First name is required" })}
                        />
                        {errors.firstName && (
                          <p className="text-sm text-red-500">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          {...register("lastName", { required: "Last name is required" })}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-red-500">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        {...register("address", { required: "Address is required" })}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-500">{errors.address.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          {...register("city", { required: "City is required" })}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-500">{errors.city.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          {...register("state", { required: "State is required" })}
                        />
                        {errors.state && (
                          <p className="text-sm text-red-500">{errors.state.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                        <Input
                          id="zipCode"
                          {...register("zipCode", { required: "ZIP/Postal code is required" })}
                        />
                        {errors.zipCode && (
                          <p className="text-sm text-red-500">{errors.zipCode.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select
                          defaultValue="United States"
                          onValueChange={(value) => {
                            // This would update the form value in a real app
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setStep(2)}
                    size="lg"
                  >
                    Continue to Delivery
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                  <RadioGroup 
                    value={shippingMethod} 
                    onValueChange={setShippingMethod}
                    className="space-y-4"
                  >
                    <div className="flex items-start gap-3 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="standard" id="standard" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="standard" className="font-medium cursor-pointer">
                          Standard Shipping (5-7 business days)
                        </Label>
                        <p className="text-sm text-gray-500">
                          Delivery between {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()} - {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="font-medium">
                        {totalPrice >= 50 ? "Free" : "$4.99"}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="express" id="express" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="express" className="font-medium cursor-pointer">
                          Express Shipping (2-3 business days)
                        </Label>
                        <p className="text-sm text-gray-500">
                          Delivery between {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()} - {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="font-medium">
                        $12.99
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back to Shipping
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setStep(3)}
                    size="lg"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="font-medium cursor-pointer flex-1">
                        Credit / Debit Card
                      </Label>
                      <CreditCard className="text-gray-400" />
                    </div>
                    
                    <div className="flex items-center gap-3 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="font-medium cursor-pointer flex-1">
                        PayPal
                      </Label>
                      <div className="text-lg font-semibold text-blue-600">PayPal</div>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "credit" && (
                    <div className="mt-6 space-y-4 border rounded-md p-6 bg-gray-50">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          {...register("cardName", { required: "Name on card is required" })}
                        />
                        {errors.cardName && (
                          <p className="text-sm text-red-500">{errors.cardName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          {...register("cardNumber", { required: "Card number is required" })}
                          placeholder="XXXX XXXX XXXX XXXX"
                        />
                        {errors.cardNumber && (
                          <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expMonth">Expiry Month</Label>
                          <Select
                            defaultValue=""
                            onValueChange={(value) => {
                              // This would update the form value in a real app
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem 
                                  key={i} 
                                  value={(i + 1).toString().padStart(2, '0')}
                                >
                                  {(i + 1).toString().padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="expYear">Expiry Year</Label>
                          <Select
                            defaultValue=""
                            onValueChange={(value) => {
                              // This would update the form value in a real app
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="YY" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() + i;
                                return (
                                  <SelectItem key={i} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            type="text"
                            maxLength={4}
                            {...register("cvv", { required: "CVV is required" })}
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 items-center text-sm text-gray-600">
                  <Shield size={16} />
                  <span>Your payment information is secure with SSL encryption.</span>
                </div>
                
                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Back to Delivery
                  </Button>
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            {/* Order Items */}
            <Accordion type="single" collapsible defaultValue="items">
              <AccordionItem value="items" className="border-none">
                <AccordionTrigger>
                  <span className="flex justify-between w-full px-3">
                    <span>{items.length} Items</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={`${item.product.id}-${index}`} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.size} &middot; Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Separator className="my-4" />
            
            {/* Cost Summary */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>
                  {totalPrice >= 50 && shippingMethod === "standard"
                    ? "Free"
                    : `$${calculateShipping().toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Total */}
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
