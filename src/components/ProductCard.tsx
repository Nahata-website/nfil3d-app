import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { inr, Product } from '@/lib/catalog';
import { C, F, R } from '@/lib/theme';

export function ProductCard({ p, width }: { p: Product; width?: number }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${p.name}, ${inr(p.price)}`}
      onPress={() => router.push(`/product/${p.id}`)}
      style={({ pressed }) => [{ width: width ?? '100%', gap: 8, opacity: pressed ? 0.85 : 1 }]}>
      <View style={{ aspectRatio: 1, borderRadius: R.lg, backgroundColor: C.cream, overflow: 'hidden' }}>
        {p.images[0] ? (
          <Image source={p.images[0]} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={150} recyclingKey={String(p.id)} />
        ) : null}
        {p.onSale ? (
          <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: C.orange, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontFamily: F.label, fontSize: 11, color: C.black }}>SALE</Text>
          </View>
        ) : null}
        {!p.inStock ? (
          <View style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: C.white, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontFamily: F.label, fontSize: 11, color: C.black }}>Out of stock</Text>
          </View>
        ) : null}
      </View>
      <Text numberOfLines={2} style={{ fontFamily: F.label, fontSize: 14, lineHeight: 19, color: C.black }}>
        {p.name}
      </Text>
      <Text style={{ fontFamily: F.body, fontSize: 14, color: C.black, marginTop: -4 }}>
        {inr(p.price)} <Text style={{ fontSize: 11, color: C.muted }}>incl. GST</Text>
      </Text>
    </Pressable>
  );
}
