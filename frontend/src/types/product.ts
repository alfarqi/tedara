export interface Product {
  id: number;
  productName: string;
  basePrice: string;
  originalPrice: string;
  stock: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  discount: string;
  discountType: string;
  productType?: string;
  placeholderName?: string;
}

export interface DetailsFormData {
  description: string;
  brand: string;
  subCategory: string;
  tags: string;
  weight: string;
  discountEndDate: string;
  gtin: string;
  mpn: string;
  storageCode: string;
  maxQuantity: string;
  subTitle: string;
  promotionalTitle: string;
}

export interface CategoryFormData {
  categoryName: string;
  categoryDescription: string;
  parentCategory: string;
}

export interface AlertsFormData {
  alertQuantity: string;
  notifyQuantity: string;
  notifyPercentage: string;
}

export interface QuantityFormData {
  enableOptions: boolean;
  options: Array<{
    name: string;
    values: string[];
  }>;
}

export interface ProductOption {
  name: string;
  values: string[];
}

