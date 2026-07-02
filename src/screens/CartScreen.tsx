import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppState } from '../context/AppStateContext';
import { CartItem, cartItemTotal } from '../models/Product';
import { productColor, productIconName } from '../utils/productColors';
import { COLORS } from '../utils/colors';

type RootStackParamList = {
  Checkout: undefined;
  Cart: undefined;
};

export default function CartScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const state = useAppState();
  const insets = useSafeAreaInsets();

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => state.clearCart() },
    ]);
  };

  if (state.cart.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>My Cart</Text>
        </View>
        <View style={styles.emptyState}>
          <MaterialIcons name="shopping-cart" size={80} color={COLORS.onSurfaceVariant} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some products to get started</Text>
          <TouchableOpacity
            onPress={() => navigation.canGoBack() && navigation.goBack()}
            style={styles.continueShopping}
          >
            <MaterialIcons name="arrow-forward" size={18} color={COLORS.white} />
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const shipping = 9.99;
  const total = state.cartTotal + shipping;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>My Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearButton}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {state.cart.map((item) => (
          <CartItemRow
            key={item.product.id}
            item={item}
            onRemove={() => state.removeFromCart(item.product.id)}
            onUpdateQuantity={(qty) => state.updateQuantity(item.product.id, qty)}
          />
        ))}
        <View style={{ height: 240 }} />
      </ScrollView>

      {/* Cart Summary sticky bottom */}
      <View style={[styles.summaryCard, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <SummaryRow label="Subtotal" value={`$${state.cartTotal.toFixed(2)}`} />
        <SummaryRow label="Shipping" value="$9.99" />
        <View style={styles.divider} />
        <SummaryRow
          label="Total"
          value={`$${total.toFixed(2)}`}
          bold
          valueColor={COLORS.primary}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutButton}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function CartItemRow({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
}) {
  const color = productColor(item.product.imageUrl);
  const iconName = productIconName(item.product.imageUrl);

  return (
    <View style={styles.cartItem}>
      {/* Image */}
      <View style={[styles.cartItemImage, { backgroundColor: color + '26' }]}>
        <MaterialCommunityIcons name={iconName as any} size={44} color={color} />
      </View>
      {/* Info */}
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.cartItemCategory}>{item.product.category}</Text>
        <View style={styles.cartItemBottom}>
          <Text style={styles.cartItemPrice}>
            ${item.product.price.toFixed(2)}
          </Text>
          <View style={styles.quantityStepper}>
            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.quantity - 1)}
              style={styles.qtyButton}
            >
              <MaterialCommunityIcons name="minus" size={16} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.quantity + 1)}
              style={styles.qtyButton}
            >
              <MaterialCommunityIcons name="plus" size={16} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Delete */}
      <TouchableOpacity onPress={onRemove} style={styles.deleteButton}>
        <MaterialCommunityIcons name="delete-outline" size={22} color={COLORS.red} />
      </TouchableOpacity>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  bold,
  valueColor,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueColor?: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, bold && styles.summaryLabelBold]}>{label}</Text>
      <Text
        style={[
          styles.summaryValue,
          bold && styles.summaryValueBold,
          valueColor ? { color: valueColor } : null,
        ]}
      >
        {value}
      </Text>
    </View>
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
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  clearButton: {
    fontSize: 14,
    color: COLORS.red,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
  continueShopping: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    marginTop: 8,
  },
  continueShoppingText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 12,
  },
  cartItemImage: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemInfo: {
    flex: 1,
    padding: 12,
  },
  cartItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.onSurface,
    marginBottom: 2,
  },
  cartItemCategory: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    marginBottom: 8,
  },
  cartItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.onSurface,
    minWidth: 16,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 12,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
  },
  summaryLabelBold: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
  },
  summaryValueBold: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.outlineVariant,
    marginVertical: 10,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
