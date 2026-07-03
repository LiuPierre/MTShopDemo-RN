import * as amplitude from '@amplitude/analytics-react-native';
import { Identify } from '@amplitude/analytics-react-native';
import { SessionReplayPlugin } from '@amplitude/plugin-session-replay-react-native';

const AMPLITUDE_API_KEY = '7cfe4ad434efad30185c52c53046e16a';

// ─── Initialise Amplitude + Session Replay ────────────────────────────────────

export async function initAmplitude(): Promise<void> {
  await amplitude.init(AMPLITUDE_API_KEY).promise;

  await amplitude.add(
    new SessionReplayPlugin({
      sampleRate: 1,         // 100% during development – lower in production
      enableRemoteConfig: true,
    })
  ).promise;
}

// ─── User identity ────────────────────────────────────────────────────────────

export function identifyUser(userId: string, name: string): void {
  amplitude.setUserId(userId);
  const identifyObj = new Identify();
  identifyObj.set('name', name);
  amplitude.identify(identifyObj);
}

// ─── Screen tracking ──────────────────────────────────────────────────────────

export function trackScreen(screenName: string, properties?: Record<string, unknown>): void {
  amplitude.track('Screen Viewed', { screen_name: screenName, ...properties });
}

// ─── Commerce events ──────────────────────────────────────────────────────────

export function trackProductViewed(params: {
  product_id: string;
  product_name: string;
  category: string;
  price: number;
  is_on_sale: boolean;
}): void {
  amplitude.track('Product Viewed', params);
}

export function trackAddToCart(params: {
  product_id: string;
  product_name: string;
  category: string;
  price: number;
  quantity: number;
}): void {
  amplitude.track('Product Added to Cart', params);
}

export function trackRemoveFromCart(params: {
  product_id: string;
  product_name: string;
}): void {
  amplitude.track('Product Removed from Cart', params);
}

export function trackFavoriteToggled(params: {
  product_id: string;
  product_name: string;
  is_favorite: boolean;
}): void {
  amplitude.track('Favorite Toggled', params);
}

export function trackCheckoutStep(step: number, step_name: string): void {
  amplitude.track('Checkout Step Viewed', { step, step_name });
}

export function trackOrderPlaced(params: {
  total: number;
  item_count: number;
  payment_method: string;
  delivery_address: string;
}): void {
  amplitude.track('Order Placed', params);
}

export function trackSearch(query: string, result_count: number): void {
  amplitude.track('Search Performed', { query, result_count });
}
