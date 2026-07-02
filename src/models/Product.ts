export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export function isOnSale(product: Product): boolean {
  return product.originalPrice != null && product.originalPrice > product.price;
}

export function discountPercent(product: Product): number {
  if (!isOnSale(product) || product.originalPrice == null) return 0;
  return Math.round((1 - product.price / product.originalPrice) * 100);
}

export function cartItemTotal(item: CartItem): number {
  return item.product.price * item.quantity;
}
