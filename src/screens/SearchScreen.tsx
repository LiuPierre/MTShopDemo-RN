import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppState } from '../context/AppStateContext';
import { Product } from '../models/Product';
import ProductCard from '../components/ProductCard';
import { COLORS } from '../utils/colors';
import { trackSearch } from '../analytics/amplitude';

const POPULAR_SEARCHES = ['Headphones', 'Sneakers', 'Hoodie', 'Watch', 'Bag', 'Candle'];

type RootStackParamList = {
  ProductDetail: { productId: string };
};

export default function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const state = useAppState();
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    state.setSearchQuery(query);
    return () => {
      state.setSearchQuery('');
    };
  }, [query]);

  const results = query
    ? state.allProducts.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  // Track search with a small debounce so we don't fire on every keystroke
  useEffect(() => {
    if (!query) return;
    const timer = setTimeout(() => {
      trackSearch(query, results.length);
    }, 600);
    return () => clearTimeout(timer);
  }, [query, results.length]);

  const handleProductTap = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Search AppBar */}
      <View style={styles.searchBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={22} color={COLORS.onSurface} />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={COLORS.onSurfaceVariant}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
            <MaterialIcons name="close" size={20} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {query === '' ? (
          /* Popular searches */
          <View style={styles.popularSection}>
            <Text style={styles.popularTitle}>Popular searches</Text>
            <View style={styles.chipsWrap}>
              {POPULAR_SEARCHES.map((term) => (
                <TouchableOpacity
                  key={term}
                  onPress={() => setQuery(term)}
                  style={styles.popularChip}
                >
                  <MaterialIcons name="search" size={14} color={COLORS.onSurfaceVariant} />
                  <Text style={styles.popularChipText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : results.length === 0 ? (
          /* No results */
          <View style={styles.noResults}>
            <MaterialIcons name="search-off" size={72} color={COLORS.onSurfaceVariant} />
            <Text style={styles.noResultsTitle}>No results for "{query}"</Text>
            <Text style={styles.noResultsSub}>Try a different search term</Text>
          </View>
        ) : (
          /* Results */
          <View>
            <Text style={styles.resultsCount}>
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </Text>
            <View style={styles.grid}>
              {results.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onTap={() => handleProductTap(product)}
                  onFavorite={() => state.toggleFavorite(product.id)}
                  onAddToCart={() => state.addToCart(product)}
                />
              ))}
            </View>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLowest,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
    gap: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.onSurface,
    paddingVertical: 8,
  },
  clearButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  scroll: {
    flex: 1,
  },
  popularSection: {
    padding: 20,
  },
  popularTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginBottom: 14,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  popularChipText: {
    fontSize: 13,
    color: COLORS.onSurface,
  },
  noResults: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
    paddingHorizontal: 40,
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.onSurface,
    textAlign: 'center',
  },
  noResultsSub: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
  },
  resultsCount: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
});
