import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppState } from '../context/AppStateContext';
import { cartItemTotal } from '../models/Product';
import { COLORS } from '../utils/colors';

type RootStackParamList = {
  OrderSuccess: undefined;
  Checkout: undefined;
};

const STEPS = ['Delivery', 'Payment', 'Review'];

const ADDRESSES = [
  { id: 0, name: 'Home', line1: '123 Maple Street', line2: 'New York, NY 10001', icon: 'home' },
  { id: 1, name: 'Work', line1: '456 Business Ave', line2: 'New York, NY 10018', icon: 'business-center' },
];

const PAYMENTS = [
  { id: 0, label: 'Visa •••• 4242', sub: 'Expires 12/26', icon: 'credit-card' },
  { id: 1, label: 'Apple Pay', sub: 'Touch ID enabled', icon: 'phone-iphone' },
  { id: 2, label: 'PayPal', sub: 'florian@example.com', icon: 'account-balance-wallet' },
];

export default function CheckoutScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const state = useAppState();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [placing, setPlacing] = useState(false);

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setPlacing(true);
      await new Promise((r) => setTimeout(r, 2000));
      state.clearCart();
      setPlacing(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'OrderSuccess' }],
        })
      );
    }
  };

  const shipping = 9.99;
  const total = state.cartTotal + shipping;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={22} color={COLORS.onSurface} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {STEPS.map((label, idx) => {
          const isDone = idx < step;
          const isActive = idx === step;
          return (
            <React.Fragment key={label}>
              {idx > 0 && (
                <View
                  style={[
                    styles.stepLine,
                    isDone || isActive ? styles.stepLineDone : styles.stepLinePending,
                  ]}
                />
              )}
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    isDone || isActive ? styles.stepCircleActive : styles.stepCirclePending,
                  ]}
                >
                  {isDone ? (
                    <MaterialIcons name="check" size={16} color={COLORS.white} />
                  ) : (
                    <Text style={[styles.stepNumber, isActive ? styles.stepNumberActive : styles.stepNumberPending]}>
                      {idx + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isDone || isActive ? styles.stepLabelActive : styles.stepLabelPending,
                  ]}
                >
                  {label}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 0 && (
          <DeliveryStep
            selected={selectedAddress}
            onSelect={setSelectedAddress}
          />
        )}
        {step === 1 && (
          <PaymentStep
            selected={selectedPayment}
            onSelect={setSelectedPayment}
          />
        )}
        {step === 2 && (
          <ReviewStep cartTotal={state.cartTotal} shipping={shipping} total={total} items={state.cart} />
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom action bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {step > 0 && (
          <TouchableOpacity
            onPress={() => setStep(step - 1)}
            style={styles.backOutlineButton}
          >
            <MaterialIcons name="arrow-back" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleNext}
          disabled={placing}
          style={styles.nextButton}
        >
          {placing ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.nextButtonText}>
              {step === 2 ? 'Place Order' : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function DeliveryStep({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (id: number) => void;
}) {
  return (
    <View>
      <Text style={styles.stepSectionTitle}>Delivery Address</Text>
      {ADDRESSES.map((addr) => {
        const isSelected = addr.id === selected;
        return (
          <TouchableOpacity
            key={addr.id}
            onPress={() => onSelect(addr.id)}
            style={[
              styles.optionCard,
              isSelected ? styles.optionCardSelected : styles.optionCardUnselected,
            ]}
          >
            <View
              style={[
                styles.optionIconBox,
                { backgroundColor: isSelected ? COLORS.primaryLight : COLORS.surfaceContainerLow },
              ]}
            >
              <MaterialIcons
                name={addr.icon as any}
                size={22}
                color={isSelected ? COLORS.primary : COLORS.onSurfaceVariant}
              />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionLabel}>{addr.name}</Text>
              <Text style={styles.optionSub}>{addr.line1}</Text>
              <Text style={styles.optionSub}>{addr.line2}</Text>
            </View>
            {isSelected && (
              <MaterialIcons name="check-circle" size={22} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={styles.addNewButton}>
        <MaterialIcons name="add" size={18} color={COLORS.primary} />
        <Text style={styles.addNewButtonText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
}

function PaymentStep({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (id: number) => void;
}) {
  return (
    <View>
      <Text style={styles.stepSectionTitle}>Payment Method</Text>
      {PAYMENTS.map((payment) => {
        const isSelected = payment.id === selected;
        return (
          <TouchableOpacity
            key={payment.id}
            onPress={() => onSelect(payment.id)}
            style={[
              styles.optionCard,
              isSelected ? styles.optionCardSelected : styles.optionCardUnselected,
            ]}
          >
            <View
              style={[
                styles.optionIconBox,
                { backgroundColor: isSelected ? COLORS.primaryLight : COLORS.surfaceContainerLow },
              ]}
            >
              <MaterialIcons
                name={payment.icon as any}
                size={22}
                color={isSelected ? COLORS.primary : COLORS.onSurfaceVariant}
              />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionLabel}>{payment.label}</Text>
              <Text style={styles.optionSub}>{payment.sub}</Text>
            </View>
            {isSelected && (
              <MaterialIcons name="check-circle" size={22} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ReviewStep({
  cartTotal,
  shipping,
  total,
  items,
}: {
  cartTotal: number;
  shipping: number;
  total: number;
  items: any[];
}) {
  return (
    <View>
      <Text style={styles.stepSectionTitle}>Order Summary</Text>
      <View style={styles.reviewCard}>
        {items.map((item) => (
          <View key={item.product.id} style={styles.reviewItem}>
            <View style={styles.reviewQtyBadge}>
              <Text style={styles.reviewQtyText}>×{item.quantity}</Text>
            </View>
            <Text style={styles.reviewItemName} numberOfLines={2}>
              {item.product.name}
            </Text>
            <Text style={styles.reviewItemPrice}>
              ${cartItemTotal(item).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <SummaryRow label="Subtotal" value={`$${cartTotal.toFixed(2)}`} />
        <SummaryRow label="Shipping" value={`$${shipping.toFixed(2)}`} />
        <SummaryRow
          label="Total"
          value={`$${total.toFixed(2)}`}
          bold
          valueColor={COLORS.primary}
        />
      </View>
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
          valueColor ? { color: valueColor } : undefined,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.surfaceContainerLowest },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepLine: { flex: 1, height: 2, marginBottom: 18 },
  stepLineDone: { backgroundColor: COLORS.primary },
  stepLinePending: { backgroundColor: COLORS.outlineVariant },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: { backgroundColor: COLORS.primary },
  stepCirclePending: { backgroundColor: COLORS.surfaceContainerLow },
  stepNumber: { fontSize: 14, fontWeight: '700' },
  stepNumberActive: { color: COLORS.white },
  stepNumberPending: { color: COLORS.onSurfaceVariant },
  stepLabel: { fontSize: 11, fontWeight: '500' },
  stepLabelActive: { color: COLORS.primary, fontWeight: '700' },
  stepLabelPending: { color: COLORS.onSurfaceVariant },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  stepSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  optionCardUnselected: {
    borderColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surface,
  },
  optionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionInfo: { flex: 1 },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.onSurface,
    marginBottom: 2,
  },
  optionSub: { fontSize: 12, color: COLORS.onSurfaceVariant },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    paddingVertical: 14,
    gap: 8,
    marginTop: 4,
  },
  addNewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  reviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  reviewQtyBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewQtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  reviewItemName: { flex: 1, fontSize: 13, color: COLORS.onSurface },
  reviewItemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.outlineVariant,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14, color: COLORS.onSurfaceVariant },
  summaryLabelBold: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  summaryValue: { fontSize: 14, color: COLORS.onSurfaceVariant },
  summaryValueBold: { fontSize: 15, fontWeight: '700' },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.outlineVariant,
  },
  backOutlineButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
