import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppState } from '../context/AppStateContext';
import { isOnSale, discountPercent } from '../models/Product';
import { productColor, productIconName } from '../utils/productColors';
import { COLORS } from '../utils/colors';

const { width } = Dimensions.get('window');

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

type RootStackParamList = {
  ProductDetail: { productId: string };
  Cart: undefined;
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ProductDetailRouteProp>();
  const state = useAppState();
  const insets = useSafeAreaInsets();

  const product = state.allProducts.find((p) => p.id === route.params.productId);
  const [selectedSize, setSelectedSize] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) return null;

  const color = productColor(product.imageUrl);
  const iconName = productIconName(product.imageUrl);
  const onSale = isOnSale(product);
  const discount = discountPercent(product);
  const showSizeSelector =
    product.category === 'Clothing' || product.category === 'Shoes';
  const inCart = state.isInCart(product.id);

  const handleAddToCart = () => {
    state.addToCart(product);
    setAddedToCart(true);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart.`, [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero area */}
        <View style={[styles.heroArea, { backgroundColor: color + '26' }]}>
          {/* Transparent back button over hero */}
          <View style={styles.heroAppBar}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.heroBackButton}
            >
              <MaterialIcons name="arrow-back" size={22} color={COLORS.onSurface} />
            </TouchableOpacity>
            <View style={styles.heroActions}>
              <TouchableOpacity
                onPress={() => state.toggleFavorite(product.id)}
                style={styles.heroActionButton}
              >
                <MaterialCommunityIcons
                  name={product.isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={product.isFavorite ? COLORS.red : COLORS.onSurface}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroActionButton}>
                <MaterialIcons name="share" size={22} color={COLORS.onSurface} />
              </TouchableOpacity>
            </View>
          </View>
          <MaterialCommunityIcons name={iconName as any} size={140} color={color} />
        </View>

        {/* Content card */}
        <View style={styles.contentCard}>
          {/* Category chip */}
          <View style={[styles.categoryChip, { backgroundColor: color + '1F' }]}>
            <Text style={[styles.categoryChipText, { color }]}>{product.category}</Text>
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialCommunityIcons
                key={star}
                name={
                  star <= Math.floor(product.rating)
                    ? 'star'
                    : star <= product.rating + 0.5
                    ? 'star-half-full'
                    : 'star-outline'
                }
                size={18}
                color={COLORS.amber}
              />
            ))}
            <Text style={styles.ratingValue}>{product.rating}</Text>
            <Text style={styles.reviewCount}>
              · {product.reviewCount.toLocaleString()} reviews
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {onSale && (
              <>
                <Text style={styles.originalPrice}>
                  ${product.originalPrice!.toFixed(2)}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>-{discount}%</Text>
                </View>
              </>
            )}
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Size selector */}
          {showSizeSelector && (
            <View>
              <Text style={styles.sectionTitle}>Size</Text>
              <View style={styles.sizeRow}>
                {SIZES.map((size, idx) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(idx)}
                    style={[
                      styles.sizeChip,
                      idx === selectedSize ? styles.sizeChipSelected : styles.sizeChipUnselected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sizeChipText,
                        idx === selectedSize
                          ? styles.sizeChipTextSelected
                          : styles.sizeChipTextUnselected,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {product.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          disabled={!inCart}
          style={[
            styles.cartOutlineButton,
            !inCart && styles.buttonDisabled,
          ]}
        >
          <MaterialIcons
            name="shopping-cart"
            size={22}
            color={inCart ? COLORS.primary : COLORS.onSurfaceVariant}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={addedToCart}
          style={[
            styles.addToCartButton,
            addedToCart && styles.addToCartButtonDone,
          ]}
        >
          <Text style={styles.addToCartText}>
            {addedToCart ? 'Added to Cart' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLowest,
  },
  scroll: {
    flex: 1,
  },
  heroArea: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAppBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  heroBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 8,
  },
  heroActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  contentCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    marginTop: -24,
    minHeight: 400,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 2,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: COLORS.errorContainer,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  discountBadgeText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: 20,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  sizeChip: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  sizeChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeChipUnselected: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderColor: COLORS.outlineVariant,
  },
  sizeChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sizeChipTextSelected: {
    color: COLORS.white,
  },
  sizeChipTextUnselected: {
    color: COLORS.onSurfaceVariant,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.outlineVariant,
  },
  cartOutlineButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonDone: {
    backgroundColor: COLORS.onSurfaceVariant,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    borderColor: COLORS.outlineVariant,
    opacity: 0.5,
  },
});
