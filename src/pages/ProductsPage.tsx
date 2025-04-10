
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  getAllProducts, 
  getCategories,
  filterProducts 
} from "@/services/productService";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, SlidersHorizontal, X } from "lucide-react";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null
  );
  const [selectedGender, setSelectedGender] = useState<string | null>(
    searchParams.get("gender") || null
  );
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [onSale, setOnSale] = useState(searchParams.get("sale") === "true");
  const [sortBy, setSortBy] = useState("featured");
  const searchQuery = searchParams.get("search") || "";

  // All possible sizes and colors for filtering
  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36"];
  const allColors = ["white", "black", "gray", "blue", "red", "green", "brown", "beige", "navy", "olive"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Get all categories for filter
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // Get products with filters
        const filters: any = {};
        
        if (selectedCategory) filters.category = selectedCategory;
        if (selectedGender) filters.gender = selectedGender;
        if (priceRange[0] > 0 || priceRange[1] < 200) {
          filters.minPrice = priceRange[0];
          filters.maxPrice = priceRange[1];
        }
        if (selectedSizes.length > 0) filters.sizes = selectedSizes;
        if (selectedColors.length > 0) filters.colors = selectedColors;
        if (onSale) filters.onSale = true;
        
        let filteredProducts = await filterProducts(filters);
        
        // Apply search query if exists
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        // Apply sorting
        switch(sortBy) {
          case "price-low-high":
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case "price-high-low":
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case "newest":
            filteredProducts.sort((a, b) => a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1);
            break;
          case "rating":
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          // featured is default, no sorting needed
        }
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    searchQuery,
    selectedCategory,
    selectedGender,
    priceRange,
    selectedSizes,
    selectedColors,
    onSale,
    sortBy
  ]);

  const updateFilters = () => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedGender) params.gender = selectedGender;
    if (onSale) params.sale = "true";
    
    setSearchParams(params);
  };

  useEffect(() => {
    updateFilters();
  }, [selectedCategory, selectedGender, onSale]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedGender(null);
    setPriceRange([0, 200]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setOnSale(false);
    setSortBy("featured");
    setSearchParams({});
  };
  
  // Helper function to handle size selection
  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(item => item !== size) 
        : [...prev, size]
    );
  };

  // Helper function to handle color selection
  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(item => item !== color) 
        : [...prev, color]
    );
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <Checkbox 
                id={`category-${category}`}
                checked={selectedCategory === category}
                onCheckedChange={() => setSelectedCategory(
                  selectedCategory === category ? null : category
                )}
              />
              <label 
                htmlFor={`category-${category}`}
                className="ml-2 text-sm cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-3">Gender</h3>
        <div className="space-y-2">
          {["men", "women", "unisex"].map((gender) => (
            <div key={gender} className="flex items-center">
              <Checkbox 
                id={`gender-${gender}`}
                checked={selectedGender === gender}
                onCheckedChange={() => setSelectedGender(
                  selectedGender === gender ? null : gender
                )}
              />
              <label 
                htmlFor={`gender-${gender}`}
                className="ml-2 text-sm capitalize cursor-pointer"
              >
                {gender}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="px-2">
          <Slider 
            min={0} 
            max={200}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="my-6"
          />
          <div className="flex items-center justify-between">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? "default" : "outline"}
              size="sm"
              className="h-8 px-3 rounded-md"
              onClick={() => handleSizeToggle(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {allColors.map((color) => (
            <Button
              key={color}
              variant="outline"
              size="sm"
              className={`h-8 px-3 rounded-md ${
                selectedColors.includes(color) ? "ring-2 ring-black" : ""
              }`}
              onClick={() => handleColorToggle(color)}
            >
              <div 
                className="w-4 h-4 rounded-full mr-1.5" 
                style={{ backgroundColor: color }} 
              />
              <span className="capitalize">{color}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <Checkbox 
          id="sale-only"
          checked={onSale}
          onCheckedChange={(checked) => setOnSale(!!checked)}
        />
        <label htmlFor="sale-only" className="ml-2 text-sm cursor-pointer">
          Sale Items Only
        </label>
      </div>

      <Button onClick={resetFilters} variant="outline" className="w-full">
        Reset All Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block w-full md:w-64 lg:w-72">
          <div className="sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Filters</h2>
            <FiltersContent />
          </div>
        </div>

        {/* Product Listing */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {searchQuery 
                  ? `Search results for "${searchQuery}"` 
                  : selectedCategory 
                    ? selectedCategory
                    : selectedGender 
                      ? `${selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1)}'s Collection`
                      : "All Products"}
              </h1>
              <p className="text-gray-500 mt-1">{products.length} products</p>
            </div>
            
            <div className="flex gap-4">
              {/* Mobile filters button */}
              <Button 
                variant="outline" 
                className="md:hidden flex items-center"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
              
              {/* Sort dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Best Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {selectedCategory && (
              <FilterTag 
                label={`Category: ${selectedCategory}`}
                onRemove={() => setSelectedCategory(null)}
              />
            )}
            {selectedGender && (
              <FilterTag 
                label={`Gender: ${selectedGender}`}
                onRemove={() => setSelectedGender(null)}
              />
            )}
            {(priceRange[0] > 0 || priceRange[1] < 200) && (
              <FilterTag 
                label={`Price: $${priceRange[0]} - $${priceRange[1]}`}
                onRemove={() => setPriceRange([0, 200])}
              />
            )}
            {selectedSizes.length > 0 && (
              <FilterTag 
                label={`Sizes: ${selectedSizes.join(", ")}`}
                onRemove={() => setSelectedSizes([])}
              />
            )}
            {selectedColors.length > 0 && (
              <FilterTag 
                label={`Colors: ${selectedColors.length} selected`}
                onRemove={() => setSelectedColors([])}
              />
            )}
            {onSale && (
              <FilterTag 
                label="Sale Items"
                onRemove={() => setOnSale(false)}
              />
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square mb-2"></div>
                  <div className="bg-gray-200 h-4 mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
          
          {products.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your filters or search term to find what you're looking for.
              </p>
              <Button onClick={resetFilters}>Reset All Filters</Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" onClick={() => setMobileFiltersOpen(false)}>
          <div 
            className="fixed inset-y-0 left-0 w-80 max-w-full bg-white p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
            
            <FiltersContent />
          </div>
        </div>
      )}
    </div>
  );
};

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

const FilterTag = ({ label, onRemove }: FilterTagProps) => (
  <div className="flex items-center bg-gray-100 rounded-full py-1 px-3 text-sm">
    <span>{label}</span>
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-5 w-5 ml-1 rounded-full" 
      onClick={onRemove}
    >
      <X size={14} />
    </Button>
  </div>
);

export default ProductsPage;
