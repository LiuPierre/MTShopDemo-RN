export function productColor(imageUrl: string): string {
  if (imageUrl.startsWith('electronics')) return '#6C63FF';
  if (imageUrl.startsWith('shoes')) return '#FF6584';
  if (imageUrl.startsWith('clothing')) return '#43C6AC';
  if (imageUrl.startsWith('home')) return '#FFB347';
  if (imageUrl.startsWith('accessories')) return '#E8677A';
  if (imageUrl.startsWith('sports')) return '#56CCF2';
  return '#9B59B6';
}

// Returns a name from @expo/vector-icons (MaterialCommunityIcons)
export function productIconName(imageUrl: string): string {
  if (imageUrl === 'electronics_1') return 'headphones';
  if (imageUrl === 'electronics_2') return 'watch';
  if (imageUrl.startsWith('electronics')) return 'speaker';
  if (imageUrl.startsWith('shoes')) return 'shoe-sneaker';
  if (imageUrl === 'clothing_1') return 'hanger';
  if (imageUrl.startsWith('clothing')) return 'tshirt-crew';
  if (imageUrl === 'home_1') return 'coffee';
  if (imageUrl.startsWith('home')) return 'candle';
  if (imageUrl === 'accessories_1') return 'bag-personal';
  if (imageUrl.startsWith('accessories')) return 'sunglasses';
  if (imageUrl.startsWith('sports')) return 'yoga';
  return 'shape';
}
