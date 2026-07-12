export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: {
    main: string;
    gallery: string[];
  };
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  colorSwatches?: Array<{ name: string; hex: string }>;
  shortDescription?: string;
  longDescription?: string;
  sizingAndFit?: string;
  materialsAndCare?: string;
  stock: number;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  salePercentage?: number;
}
