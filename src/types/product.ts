
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  sizes: string[];
  colors: string[];
  gender: 'men' | 'women' | 'unisex';
  rating: number;
  reviews: number;
  isFeatured: boolean;
  isNew: boolean;
  isSale: boolean;
  discount?: number;
}
