import { Product } from '../models/Product';

export const kProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Experience premium audio quality with industry-leading noise cancellation. These headphones deliver crystal-clear sound with deep bass and crisp highs, perfect for music lovers and professionals alike.',
    price: 249.99,
    originalPrice: 349.99,
    category: 'Electronics',
    imageUrl: 'electronics_1',
    rating: 4.8,
    reviewCount: 2341,
    isFavorite: false,
    tags: ['wireless', 'noise-cancelling', 'premium'],
  },
  {
    id: '2',
    name: 'Smart Watch Series X',
    description:
      'Stay connected and track your health with this advanced smartwatch. Features GPS, heart rate monitoring, sleep tracking, and a stunning AMOLED display with 7-day battery life.',
    price: 399.99,
    category: 'Electronics',
    imageUrl: 'electronics_2',
    rating: 4.6,
    reviewCount: 1872,
    isFavorite: false,
    tags: ['smart', 'health', 'GPS'],
  },
  {
    id: '3',
    name: 'Minimalist Leather Sneakers',
    description:
      'Handcrafted from premium Italian leather, these sneakers combine timeless style with everyday comfort. The minimalist design makes them perfect for any occasion.',
    price: 189.0,
    originalPrice: 220.0,
    category: 'Shoes',
    imageUrl: 'shoes_1',
    rating: 4.5,
    reviewCount: 934,
    isFavorite: false,
    tags: ['leather', 'handcrafted', 'minimalist'],
  },
  {
    id: '4',
    name: 'Running Shoes Pro',
    description:
      'Engineered for performance, these running shoes feature responsive cushioning and breathable mesh upper. Ideal for road running and gym workouts.',
    price: 129.99,
    category: 'Shoes',
    imageUrl: 'shoes_2',
    rating: 4.7,
    reviewCount: 3120,
    isFavorite: false,
    tags: ['running', 'sport', 'lightweight'],
  },
  {
    id: '5',
    name: 'Organic Cotton Hoodie',
    description:
      'Made from 100% organic cotton, this hoodie is soft, sustainable, and stylish. Perfect for casual wear and outdoor adventures.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Clothing',
    imageUrl: 'clothing_1',
    rating: 4.4,
    reviewCount: 567,
    isFavorite: false,
    tags: ['organic', 'sustainable', 'comfort'],
  },
  {
    id: '6',
    name: 'Slim Fit Chinos',
    description:
      'Versatile and comfortable chinos with a modern slim fit. Crafted from stretch cotton blend for all-day comfort whether at the office or on weekends.',
    price: 64.99,
    category: 'Clothing',
    imageUrl: 'clothing_2',
    rating: 4.3,
    reviewCount: 412,
    isFavorite: false,
    tags: ['slim', 'versatile', 'stretch'],
  },
  {
    id: '7',
    name: 'Portable Bluetooth Speaker',
    description:
      'Take the party anywhere with this waterproof portable speaker. Features 360° sound, 12-hour battery, and can be paired with two speakers for stereo sound.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'Electronics',
    imageUrl: 'electronics_3',
    rating: 4.5,
    reviewCount: 1654,
    isFavorite: false,
    tags: ['portable', 'waterproof', 'bass'],
  },
  {
    id: '8',
    name: 'Ceramic Coffee Mug Set',
    description:
      'A set of 4 hand-painted ceramic mugs, each with a unique design. Microwave and dishwasher safe, perfect for your morning coffee ritual.',
    price: 44.99,
    category: 'Home',
    imageUrl: 'home_1',
    rating: 4.9,
    reviewCount: 288,
    isFavorite: false,
    tags: ['ceramic', 'handpainted', 'set'],
  },
  {
    id: '9',
    name: 'Scented Soy Candle Collection',
    description:
      'A curated collection of 3 luxury soy candles with calming scents: Lavender Dreams, Vanilla Comfort, and Forest Walk. Each burns for 40+ hours.',
    price: 59.99,
    category: 'Home',
    imageUrl: 'home_2',
    rating: 4.7,
    reviewCount: 743,
    isFavorite: false,
    tags: ['soy', 'luxury', 'relaxation'],
  },
  {
    id: '10',
    name: 'Crossbody Leather Bag',
    description:
      'A compact yet spacious crossbody bag crafted from full-grain leather. Features multiple compartments and gold-tone hardware for a sophisticated look.',
    price: 149.0,
    originalPrice: 179.0,
    category: 'Accessories',
    imageUrl: 'accessories_1',
    rating: 4.6,
    reviewCount: 521,
    isFavorite: false,
    tags: ['leather', 'compact', 'gold'],
  },
  {
    id: '11',
    name: 'Polarized Sunglasses',
    description:
      'Protect your eyes in style with these UV400 polarized sunglasses. Lightweight titanium frame with scratch-resistant lenses, available in multiple colors.',
    price: 119.99,
    category: 'Accessories',
    imageUrl: 'accessories_2',
    rating: 4.4,
    reviewCount: 398,
    isFavorite: false,
    tags: ['polarized', 'UV400', 'titanium'],
  },
  {
    id: '12',
    name: 'Yoga Mat Premium',
    description:
      'Eco-friendly yoga mat made from natural tree rubber. Non-slip surface, 6mm cushioning, and alignment lines for proper positioning. Includes carry strap.',
    price: 54.99,
    category: 'Sports',
    imageUrl: 'sports_1',
    rating: 4.8,
    reviewCount: 1102,
    isFavorite: false,
    tags: ['eco-friendly', 'non-slip', 'thick'],
  },
];

export const kCategories: string[] = [
  'All',
  'Electronics',
  'Clothing',
  'Shoes',
  'Accessories',
  'Home',
  'Sports',
];

export interface Banner {
  title: string;
  subtitle: string;
  cta: string;
  color: string;
}

export const kBanners: Banner[] = [
  {
    title: 'Summer Sale',
    subtitle: 'Up to 40% off on selected items',
    cta: 'Shop Now',
    color: '#6C63FF',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Discover the latest trends',
    cta: 'Explore',
    color: '#FF6584',
  },
  {
    title: 'Free Shipping',
    subtitle: 'On all orders over $75',
    cta: 'Learn More',
    color: '#43C6AC',
  },
];
