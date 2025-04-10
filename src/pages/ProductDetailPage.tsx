
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "@/services/productService";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Heart, Minus, Plus, Share2, ShoppingBag, Star } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  
  const { toast } = useToast();
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const productData = await getProductById(id);
          if (productData) {
            setProduct(productData);
            // Set default selected color
            if (productData.colors.length > 0) {
              setSelectedColor(productData.colors[0]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You must select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }
    
    addItem(product, quantity, selectedSize);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} (${selectedSize}) added to your cart`,
    });
  };

  const calculateFinalPrice = () => {
    if (!product) return 0;
    if (product.isSale && product.discount) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 animate-pulse bg-gray-200 aspect-square"></div>
          <div className="w-full md:w-1/2 animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }
  
  // Mock image gallery (would use product-specific images in a real app)
  const imageGallery = [
    product.image,
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:underline">Products</Link>
        <span className="mx-2">/</span>
        <Link 
          to={`/products?category=${product.category}`} 
          className="hover:underline"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-500">{product.name}</span>
      </div>
      
      {/* Product Detail */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="w-full md:w-1/2">
          <div className="flex flex-col md:flex-row md:gap-4">
            {/* Thumbnail Gallery (on larger screens) */}
            <div className="hidden md:flex flex-col gap-2 w-1/5">
              {imageGallery.map((src, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border rounded aspect-square overflow-hidden ${
                    selectedImage === index 
                      ? "border-black" 
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${product.name} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="w-full md:w-4/5">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={imageGallery[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              
              {/* Mobile Thumbnail Gallery */}
              <div className="flex gap-2 mt-4 md:hidden overflow-x-auto py-2">
                {imageGallery.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border rounded-md flex-shrink-0 w-16 h-16 ${
                      selectedImage === index 
                        ? "border-black" 
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${product.name} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <div className="flex flex-col space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mt-2">
                <div className="flex mr-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(product.rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating.toFixed(1)} ({product.reviews} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="mt-4">
                {product.isSale ? (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold mr-2">
                      ${calculateFinalPrice().toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-medium">
                      {product.discount}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="h-px bg-gray-200 my-4"></div>
              
              {/* Description */}
              <p className="text-gray-600">{product.description}</p>

              <div className="h-px bg-gray-200 my-4"></div>
              
              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Color</h3>
                  <RadioGroup 
                    value={selectedColor} 
                    onValueChange={setSelectedColor}
                    className="flex gap-2"
                  >
                    {product.colors.map((color) => (
                      <div key={color} className="flex items-center">
                        <RadioGroupItem 
                          value={color} 
                          id={`color-${color}`}
                          className="sr-only"
                        />
                        <label 
                          htmlFor={`color-${color}`}
                          className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border ${
                            selectedColor === color 
                              ? "ring-2 ring-black" 
                              : "ring-1 ring-transparent hover:ring-gray-400"
                          }`}
                        >
                          <span 
                            className="w-6 h-6 rounded-full" 
                            style={{ backgroundColor: color }}
                          ></span>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              
              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-medium">Size</h3>
                  <button className="text-sm text-gray-500 hover:underline">
                    Size Guide
                  </button>
                </div>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Quantity</h3>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="rounded-r-none"
                  >
                    <Minus size={16} />
                  </Button>
                  <div className="w-16 h-10 flex items-center justify-center border-y">
                    {quantity}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="rounded-l-none"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <Button 
                  className="flex-1 h-12 text-base" 
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={20} className="mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="md:h-12 md:w-12">
                  <Heart size={20} />
                </Button>
                <Button variant="outline" size="icon" className="md:h-12 md:w-12">
                  <Share2 size={20} />
                </Button>
              </div>
              
              {/* Additional Info */}
              <div className="mt-6 text-sm text-gray-500">
                <p className="flex items-center mb-1">
                  <span className="font-medium mr-2">SKU:</span> 
                  {product.id}
                </p>
                <p className="flex items-center mb-1">
                  <span className="font-medium mr-2">Category:</span> 
                  <Link 
                    to={`/products?category=${product.category}`}
                    className="hover:underline"
                  >
                    {product.category}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="py-6">
            <div className="max-w-3xl mx-auto space-y-4">
              <h3 className="text-xl font-semibold">Product Details</h3>
              <p>{product.description}</p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>High-quality materials</li>
                  <li>Comfortable fit</li>
                  <li>Machine washable</li>
                  <li>Imported</li>
                </ul>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Materials:</h4>
                <p>100% Premium Cotton</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Customer Reviews</h3>
                <Button>Write a Review</Button>
              </div>
              
              <div className="border-t border-gray-200">
                {/* Example Review */}
                <div className="py-6 border-b border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">Great product!</h4>
                      <div className="flex items-center mt-1 mb-2">
                        <div className="flex mr-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          by John D. on March 15, 2025
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">Verified Purchase</span>
                  </div>
                  <p className="text-gray-600">
                    This is exactly what I was looking for. The quality is excellent and it fits perfectly.
                    Would definitely recommend to anyone considering this purchase!
                  </p>
                </div>
                
                {/* Example Review */}
                <div className="py-6 border-b border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">Good but runs small</h4>
                      <div className="flex items-center mt-1 mb-2">
                        <div className="flex mr-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          by Sarah M. on February 28, 2025
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">Verified Purchase</span>
                  </div>
                  <p className="text-gray-600">
                    The quality is nice but I had to exchange for a larger size. I recommend sizing up if you're between sizes.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <Button variant="outline">View More Reviews</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Shipping Information</h3>
                <p className="mb-4">
                  We offer the following shipping options for all orders:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Standard Shipping (5-7 business days): $4.99</li>
                  <li>Express Shipping (2-3 business days): $12.99</li>
                  <li>Next Day Delivery (order before 2pm): $19.99</li>
                  <li>Free Standard Shipping on orders over $50</li>
                </ul>
                <p className="mt-4">
                  Orders are processed and shipped Monday through Friday, excluding holidays.
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Return Policy</h3>
                <p className="mb-4">
                  We want you to be completely satisfied with your purchase. If for any reason you are not, 
                  we accept returns under the following conditions:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Items must be returned within 30 days of delivery</li>
                  <li>Items must be unworn, unwashed, and in original packaging</li>
                  <li>Return shipping costs are the responsibility of the customer</li>
                  <li>Refunds will be processed within 5-7 business days after receipt</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetailPage;
