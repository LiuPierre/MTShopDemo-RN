import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Product, isOnSale, discountPercent } from '../models/Product';
import { productColor, productIconName } from '../utils/productColors';
import { COLORS } from '../utils/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 16 * 2 - 12) / 2;
const CARD_HEIGHT = CARD_WIDTH / 0.72;

interface ProductCardProps {
  product: Product;
  onTap: () => void;
  onFavorite: () => void;
  onAddToCart: () => void;
}

export default function ProductCard({
  product,
  onTap,
  onFavorite,
  onAddToCart,
}: ProductCardProps) {
  const color = productColor(product.imageUrl);
  const iconName = productIconName(product.imageUrl);
  const onSale = isOnSale(product);
  const discount = discountPercent(product);

  return (
    <TouchableOpacity onPress={onTap} activeOpacity={0.9} style={styles.card}>
      {/* Image area */}
      <View style={[styles.imageArea, { backgroundColor: color + '26' }]}>
        <MaterialCommunityIcons name={iconName as any} size={72} color={color} />

        {onSale && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>-{discount}%</Text>
          </View>
        )}

        <TouchableOpacity onPress={onFavorite} style={styles.favoriteButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialCommunityIcons
            name={product.isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={product.isFavorite ? COLORS.red : COLORS.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>

      {/* Info area */}
      <View style={styles.infoArea}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.ratingRow}>
          <MaterialCommunityIcons name="star" size={14} color={COLORS.amber} />
          <Text style={styles.ratingText}>
            {product.rating} ({product.reviewCount.toLocaleString()})
          </Text>
        </View>
        <View style={styles.priceRow}>
          <View>
            <Text style={[styles.price, { color: COLORS.primary }]}>
              ${product.price.toFixed(2)}
            </Text>
            {onSale && (
              <Text style={styles.originalPrice}>
                ${product.originalPrice!.toFixed(2)}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={onAddToCart}
            style={[styles.addButton, { backgroundColor: COLORS.primary }]}
          >
            <MaterialCommunityIcons name="plus" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.red,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  saleBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoArea: {
    padding: 12,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.onSurface,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
