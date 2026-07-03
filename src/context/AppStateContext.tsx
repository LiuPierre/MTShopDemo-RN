import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, CartItem, cartItemTotal } from '../models/Product';
import { kProducts } from '../data/products';
import {
  trackAddToCart,
  trackRemoveFromCart,
  trackFavoriteToggled,
} from '../analytics/amplitude';

interface AppStateContextType {
  products: Product[];
  allProducts: Product[];
  cart: CartItem[];
  selectedCategory: string;
  searchQuery: string;
  favorites: Product[];
  cartItemCount: number;
  cartTotal: number;
  featuredProducts: Product[];
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  toggleFavorite: (productId: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [allProductsList, setAllProductsList] = useState<Product[]>([...kProducts]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQueryState] = useState<string>('');

  const products = allProductsList.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      q === '' ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const favorites = allProductsList.filter((p) => p.isFavorite);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + cartItemTotal(item), 0);
  const featuredProducts = allProductsList.filter(
    (p) => p.originalPrice != null && p.originalPrice > p.price
  );

  const setCategory = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setAllProductsList((prev) => {
      const updated = prev.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      );
      const changed = updated.find((p) => p.id === productId);
      if (changed) {
        trackFavoriteToggled({
          product_id: changed.id,
          product_name: changed.name,
          is_favorite: changed.isFavorite,
        });
      }
      return updated;
    });
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const newQuantity = existing ? existing.quantity + 1 : 1;
      trackAddToCart({
        product_id: product.id,
        product_name: product.name,
        category: product.category,
        price: product.price,
        quantity: newQuantity,
      });
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item) {
        trackRemoveFromCart({
          product_id: item.product.id,
          product_name: item.product.name,
        });
      }
      return prev.filter((i) => i.product.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const isInCart = useCallback(
    (productId: string) => cart.some((item) => item.product.id === productId),
    [cart]
  );

  return (
    <AppStateContext.Provider
      value={{
        products,
        allProducts: allProductsList,
        cart,
        selectedCategory,
        searchQuery,
        favorites,
        cartItemCount,
        cartTotal,
        featuredProducts,
        setCategory,
        setSearchQuery,
        toggleFavorite,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextType {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
