import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { useAppState } from '../context/AppStateContext';
import { COLORS } from '../utils/colors';

interface MenuItem {
  label: string;
  icon: string;
  badge?: string;
  trailing?: string;
}

interface Section {
  title: string;
  items: MenuItem[];
}

const SECTIONS: Section[] = [
  {
    title: 'Account',
    items: [
      { label: 'Personal Information', icon: 'person-outline' },
      { label: 'Addresses', icon: 'location-on' },
      { label: 'Payment Methods', icon: 'credit-card' },
      { label: 'Notifications', icon: 'notifications-none' },
    ],
  },
  {
    title: 'Orders',
    items: [
      { label: 'My Orders', icon: 'shopping-bag', badge: '3' },
      { label: 'Track Order', icon: 'local-shipping' },
      { label: 'Returns & Refunds', icon: 'assignment-return' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help Center', icon: 'help-outline' },
      { label: 'Privacy Policy', icon: 'privacy-tip' },
      { label: 'About', icon: 'info-outline', trailing: 'v1.0.0' },
    ],
  },
];

export default function ProfileScreen() {
  const state = useAppState();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Profile</Text>
        <TouchableOpacity>
          <MaterialIcons name="settings" size={24} color={COLORS.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>FD</Text>
            </View>
            <View style={styles.editBadge}>
              <MaterialIcons name="edit" size={14} color={COLORS.white} />
            </View>
          </View>
          <Text style={styles.userName}>Florian Dupire</Text>
          <Text style={styles.userEmail}>florian@example.com</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatChip value="12" label="Orders" />
            <View style={styles.statsDivider} />
            <StatChip value={String(state.favorites.length)} label="Wishlist" />
            <View style={styles.statsDivider} />
            <StatChip value="8" label="Reviews" />
          </View>
        </View>

        {/* Menu Sections */}
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <TouchableOpacity key={item.label} style={styles.menuItem}>
                <MaterialIcons
                  name={item.icon as any}
                  size={22}
                  color={COLORS.onSurfaceVariant}
                />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                {item.badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                ) : item.trailing ? (
                  <Text style={styles.trailingText}>{item.trailing}</Text>
                ) : (
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color={COLORS.onSurfaceVariant}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton}>
          <MaterialCommunityIcons name="logout" size={18} color={COLORS.red} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  profileHeader: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 28,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statChip: { alignItems: 'center' },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  statsDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.outlineVariant,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.onSurface,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  trailingText: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.red,
    gap: 10,
    marginBottom: 8,
  },
  signOutText: {
    color: COLORS.red,
    fontWeight: '700',
    fontSize: 15,
  },
});
