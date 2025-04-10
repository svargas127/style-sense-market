
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Product } from "@/types/product";
import { 
  getFeaturedProducts, 
  getNewArrivals, 
  getSaleProducts 
} from "@/services/productService";
import { ArrowRight } from "lucide-react";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [featured, newArrival, sale] = await Promise.all([
          getFeaturedProducts(),
          getNewArrivals(),
          getSaleProducts(),
        ]);
        setFeaturedProducts(featured);
        setNewArrivals(newArrival);
        setSaleProducts(sale);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] bg-gray-900 overflow-hidden">
        <img
          src="/denim-jacket.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 banner-gradient"></div>
        <div className="relative h-full flex items-center container mx-auto px-4">
          <div className="max-w-md">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              New Arrivals for Summer
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Discover our latest collection of trendy styles for the season.
            </p>
            <div className="flex space-x-4">
              <Button asChild size="lg" className="font-medium">
                <Link to="/products?category=new">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-medium bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Link to="/products">View All</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard 
            title="Men's Collection" 
            image="/slim-fit-jeans.jpg" 
            link="/products?gender=men" 
          />
          <CategoryCard 
            title="Women's Collection" 
            image="/floral-midi-dress.jpg" 
            link="/products?gender=women" 
          />
          <CategoryCard 
            title="Accessories" 
            image="/leather-jacket.jpg" 
            link="/products?category=accessories" 
          />
          <CategoryCard 
            title="Sale Items" 
            image="/high-waisted-leggings.jpg" 
            link="/products?sale=true" 
          />
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button asChild variant="ghost" className="flex items-center">
            <Link to="/products">
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square mb-2"></div>
                <div className="bg-gray-200 h-4 mb-2"></div>
                <div className="bg-gray-200 h-4 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid products={featuredProducts.slice(0, 8)} />
        )}
      </div>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Button asChild variant="ghost" className="flex items-center">
              <Link to="/products?category=new">
                View All <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square mb-2"></div>
                  <div className="bg-gray-200 h-4 mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={newArrivals} />
          )}
        </div>
      )}

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">On Sale</h2>
            <Button asChild variant="ghost" className="flex items-center">
              <Link to="/products?sale=true">
                View All <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square mb-2"></div>
                  <div className="bg-gray-200 h-4 mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={saleProducts} />
          )}
        </div>
      )}

      {/* Promotion Banner */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Summer Sale Up To 50% Off
                </h3>
                <p className="text-white/80 mb-6">
                  Limited time offer on our summer collection. Don't miss out!
                </p>
                <Button asChild size="lg" className="font-medium">
                  <Link to="/products?sale=true">Shop Now</Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 aspect-video md:aspect-auto">
              <img
                src="/cotton-shorts.jpg"
                alt="Summer Sale"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gray-100 rounded-lg p-8 md:p-12 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Join Our Newsletter</h3>
          <p className="text-gray-600 mb-6">
            Subscribe and get 10% off your first order plus receive updates on new arrivals and special offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email"
              className="flex-grow"
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

interface CategoryCardProps {
  title: string;
  image: string;
  link: string;
}

const CategoryCard = ({ title, image, link }: CategoryCardProps) => {
  return (
    <Link to={link} className="block group">
      <div className="relative overflow-hidden rounded-lg aspect-square">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity group-hover:bg-opacity-30">
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default HomePage;
