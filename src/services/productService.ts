
import { Product } from '@/types/product';

// Mock product data
const products: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    description: 'A comfortable, classic fit cotton t-shirt featuring a crew neck and short sleeves. Perfect for everyday wear.',
    price: 19.99,
    category: 'T-Shirts',
    image: '/classic-white-tshirt.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['white', 'black', 'gray'],
    gender: 'unisex',
    rating: 4.5,
    reviews: 120,
    isFeatured: true,
    isNew: false,
    isSale: false
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans with stretch for comfort. Features five pockets and a button closure.',
    price: 59.99,
    category: 'Jeans',
    image: '/slim-fit-jeans.jpg',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['blue', 'black', 'lightblue'],
    gender: 'men',
    rating: 4.3,
    reviews: 85,
    isFeatured: true,
    isNew: false,
    isSale: true,
    discount: 15
  },
  {
    id: '3',
    name: 'Floral Midi Dress',
    description: 'A beautiful floral print midi dress with a flowing silhouette and three-quarter sleeves.',
    price: 79.99,
    category: 'Dresses',
    image: '/floral-midi-dress.jpg',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['floral'],
    gender: 'women',
    rating: 4.7,
    reviews: 62,
    isFeatured: false,
    isNew: true,
    isSale: false
  },
  {
    id: '4',
    name: 'Oversized Hoodie',
    description: 'Cozy oversized hoodie made from soft cotton blend. Features a kangaroo pocket and drawstring hood.',
    price: 49.99,
    category: 'Hoodies',
    image: '/oversized-hoodie.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['gray', 'black', 'navy'],
    gender: 'unisex',
    rating: 4.8,
    reviews: 110,
    isFeatured: true,
    isNew: false,
    isSale: false
  },
  {
    id: '5',
    name: 'High-Waisted Leggings',
    description: 'Comfortable high-waisted leggings made from stretchy, moisture-wicking fabric. Perfect for workouts or casual wear.',
    price: 34.99,
    category: 'Activewear',
    image: '/high-waisted-leggings.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['black', 'gray', 'navy'],
    gender: 'women',
    rating: 4.6,
    reviews: 195,
    isFeatured: true,
    isNew: false,
    isSale: true,
    discount: 10
  },
  {
    id: '6',
    name: 'Leather Jacket',
    description: 'Classic leather jacket with a modern twist. Features zippered pockets and adjustable waist belt.',
    price: 199.99,
    category: 'Jackets',
    image: '/leather-jacket.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['black', 'brown'],
    gender: 'unisex',
    rating: 4.9,
    reviews: 45,
    isFeatured: false,
    isNew: true,
    isSale: false
  },
  {
    id: '7',
    name: 'Cotton Shorts',
    description: 'Casual cotton shorts with elastic waistband and drawstring closure. Includes side pockets.',
    price: 29.99,
    category: 'Shorts',
    image: '/cotton-shorts.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['beige', 'navy', 'olive'],
    gender: 'men',
    rating: 4.2,
    reviews: 58,
    isFeatured: false,
    isNew: false,
    isSale: false
  },
  {
    id: '8',
    name: 'Pleated Skirt',
    description: 'Elegant pleated skirt with side zip closure. Perfect for office wear or casual outings.',
    price: 44.99,
    category: 'Skirts',
    image: '/pleated-skirt.jpg',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['black', 'navy', 'burgundy'],
    gender: 'women',
    rating: 4.4,
    reviews: 37,
    isFeatured: false,
    isNew: true,
    isSale: false
  },
  {
    id: '9',
    name: 'Denim Jacket',
    description: 'Classic denim jacket with button front closure and chest pockets. Perfect for layering.',
    price: 69.99,
    category: 'Jackets',
    image: '/denim-jacket.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['blue', 'lightblue', 'black'],
    gender: 'unisex',
    rating: 4.5,
    reviews: 92,
    isFeatured: true,
    isNew: false,
    isSale: false
  },
  {
    id: '10',
    name: 'Linen Button-Down Shirt',
    description: 'Lightweight linen shirt with button-down collar and long sleeves. Perfect for warm weather.',
    price: 54.99,
    category: 'Shirts',
    image: '/linen-shirt.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['white', 'blue', 'beige'],
    gender: 'men',
    rating: 4.6,
    reviews: 75,
    isFeatured: false,
    isNew: false,
    isSale: true,
    discount: 20
  }
];

// Get all products
export const getAllProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products), 300);
  });
};

// Get featured products
export const getFeaturedProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products.filter(product => product.isFeatured)), 300);
  });
};

// Get new arrivals
export const getNewArrivals = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products.filter(product => product.isNew)), 300);
  });
};

// Get sale products
export const getSaleProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products.filter(product => product.isSale)), 300);
  });
};

// Get product by ID
export const getProductById = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products.find(product => product.id === id)), 300);
  });
};

// Get products by category
export const getProductsByCategory = (category: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products.filter(product => product.category === category)), 300);
  });
};

// Get products by gender
export const getProductsByGender = (gender: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products.filter(product => product.gender === gender)), 300);
  });
};

// Get product categories
export const getCategories = (): Promise<string[]> => {
  return new Promise((resolve) => {
    const categories = [...new Set(products.map(product => product.category))];
    setTimeout(() => resolve(categories), 300);
  });
};

// Search products
export const searchProducts = (query: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    const results = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) || 
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    setTimeout(() => resolve(results), 300);
  });
};

// Filter products
export const filterProducts = (filters: {
  category?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  onSale?: boolean;
}): Promise<Product[]> => {
  return new Promise((resolve) => {
    let filtered = [...products];
    
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    if (filters.gender) {
      filtered = filtered.filter(p => p.gender === filters.gender);
    }
    
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }
    
    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(p => 
        filters.sizes!.some(size => p.sizes.includes(size))
      );
    }
    
    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(p => 
        filters.colors!.some(color => p.colors.includes(color))
      );
    }
    
    if (filters.onSale) {
      filtered = filtered.filter(p => p.isSale);
    }
    
    setTimeout(() => resolve(filtered), 300);
  });
};
