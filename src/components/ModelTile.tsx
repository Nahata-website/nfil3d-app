import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { cleanModelName, Product } from '@/lib/catalog';
import { C, F, R } from '@/lib/theme';

export function ModelTile({ m, width, height }: { m: Product; width?: number; height?: number }) {
  const name = cleanModelName(m.name);
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={name} onPress={() => router.push(`/model/${m.id}`)} style={({ pressed }) => ({ width: width ?? '100%', gap: 8, opacity: pressed ? 0.85 : 1 })}>
      <View style={{ height: height ?? width ?? 160, borderRadius: R.lg, backgroundColor: C.cream, overflow: 'hidden' }}>
        {m.images[0] ? <Image source={m.images[0]} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={150} /> : null}
        <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: C.white, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
          <Text style={{ fontFamily: F.label, fontSize: 11, color: C.success }}>FREE</Text>
        </View>
      </View>
      <Text numberOfLines={2} style={{ fontFamily: F.label, fontSize: 14, lineHeight: 19, color: C.black }}>
        {name}
      </Text>
    </Pressable>
  );
}
