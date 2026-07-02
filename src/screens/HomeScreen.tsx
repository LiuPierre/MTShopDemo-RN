import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppState } from '../context/AppStateContext';
import { kBanners, kCategories } from '../data/products';
import { Product } from '../models/Product';
import ProductCard from '../components/ProductCard';
import { COLORS } from '../utils/colors';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 160;

type RootStackParamList = {
  ProductDetail: { productId: string };
  Cart: undefined;
  Search: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const state = useAppState();
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerScrollRef = useRef<ScrollView>(null);

  const handleBannerScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
      setBannerIndex(idx);
    },
    []
  );

  const handleProductTap = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', { productId: product.id });
    },
    [navigation]
  );

  const handleCartPress = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <View style={styles.appBarLeft}>
          <View style={styles.logoBox}>
            <MaterialCommunityIcons name="shopping" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.appBarTitle}>ShopDemo</Text>
        </View>
        <View style={styles.appBarActions}>
          <TouchableOpacity onPress={handleSearchPress} style={styles.iconButton}>
            <MaterialIcons name="search" size={24} color={COLORS.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCartPress} style={styles.iconButton}>
            <MaterialIcons name="shopping-cart" size={24} color={COLORS.onSurface} />
            {state.cartItemCount > 0 && (
              <View style={styles.cartBadge} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner Carousel */}
        <ScrollView
          ref={bannerScrollRef}
          horizontal
          pagingEnabled={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width - 32 + 12}
          decelerationRate="fast"
          contentContainerStyle={styles.bannerContainer}
          onMomentumScrollEnd={handleBannerScroll}
        >
          {kBanners.map((banner, idx) => (
            <View
              key={idx}
              style={[styles.bannerCard, { backgroundColor: banner.color }]}
            >
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                <View style={styles.bannerCta}>
                  <Text style={[styles.bannerCtaText, { color: banner.color }]}>
                    {banner.cta}
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name="tag"
                size={72}
                color="rgba(255,255,255,0.3)"
                style={styles.bannerIcon}
              />
            </View>
          ))}
        </ScrollView>
        {/* Pagination dots */}
        <View style={styles.dotsRow}>
          {kBanners.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === bannerIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Category Chips */}
        <Text style={styles.sectionLabel}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {kCategories.map((cat) => {
            const selected = state.selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => state.setCategory(cat)}
                style={[
                  styles.chip,
                  selected ? styles.chipSelected : styles.chipUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selected ? styles.chipTextSelected : styles.chipTextUnselected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Products header */}
        <View style={styles.productsHeader}>
          <Text style={styles.productsHeaderTitle}>
            {state.selectedCategory === 'All' ? 'All Products' : state.selectedCategory}
          </Text>
          <Text style={styles.productsHeaderCount}>{state.products.length} items</Text>
        </View>

        {/* Product Grid */}
        {state.products.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={64} color={COLORS.onSurfaceVariant} />
            <Text style={styles.emptyStateText}>No products found</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {state.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onTap={() => handleProductTap(product)}
                onFavorite={() => state.toggleFavorite(product.id)}
                onAddToCart={() => state.addToCart(product)}
              />
            ))}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLowest,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
  },
  appBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  appBarActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    padding: 6,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.red,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  bannerContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  bannerCard: {
    width: width - 32,
    height: BANNER_HEIGHT,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 12,
  },
  bannerCta: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  bannerCtaText: {
    fontWeight: '700',
    fontSize: 13,
  },
  bannerIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -36,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    gap: 6,
  },
  dot: {
    borderRadius: 4,
    height: 6,
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.primary,
  },
  dotInactive: {
    width: 6,
    backgroundColor: COLORS.outlineVariant,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginLeft: 16,
    marginBottom: 10,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipUnselected: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.outlineVariant,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: COLORS.white,
    fontWeight: '700',
  },
  chipTextUnselected: {
    color: COLORS.onSurfaceVariant,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  productsHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  productsHeaderCount: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 48,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
  },
});
