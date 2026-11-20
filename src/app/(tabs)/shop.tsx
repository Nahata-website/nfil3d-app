import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import { Chip, H1, IconButton, Muted, Row, Screen } from '@/components/ui';
import { SHOP_TABS, ShopTab, shopTabOf, useCatalog } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { C, F } from '@/lib/theme';

// NFIL3D's own products lead every list.
const isOwn = (p: { name: string }) => /nfil3d|^mini-?n |^n[12] 3d printer|premium|rpla/i.test(p.name);

export default function Shop() {
  const params = useLocalSearchParams<{ tab?: ShopTab }>();
  const [tab, setTab] = useState<ShopTab>(params.tab ?? 'printers');
  const [q, setQ] = useState('');
  const products = useCatalog();
  const { cart } = useStore();
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products
      .filter((p) => (p.price ?? 0) > 0)
      .filter((p) => (query ? p.name.toLowerCase().includes(query) : shopTabOf(p) === tab))
      .sort((a, b) => Number(isOwn(b)) - Number(isOwn(a)) || Number(b.inStock) - Number(a.inStock));
  }, [products, tab, q]);

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <H1>Shop</H1>
        <IconButton icon="shopping-bag" label="Cart" badge={cartCount} onPress={() => router.push('/cart')} />
      </Row>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, height: 48, paddingHorizontal: 16, borderRadius: 14, backgroundColor: C.cream }}>
        <Feather name="search" size={18} color={C.muted} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search printers, PLA+, 3D pens…"
          placeholderTextColor={C.muted}
          accessibilityLabel="Search products"
          style={{ flex: 1, fontFamily: F.body, fontSize: 15, height: 48 }}
        />
      </View>
      {!q ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {SHOP_TABS.map((t) => (
            <Chip key={t.key} label={t.label} active={t.key === tab} onPress={() => setTab(t.key)} />
          ))}
        </ScrollView>
      ) : (
        <Muted>{list.length} results</Muted>
      )}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 22 }}>
        {list.map((p) => (
          <View key={p.id} style={{ width: '48%' }}>
            <ProductCard p={p} />
          </View>
        ))}
      </View>
      {!list.length ? <Muted style={{ textAlign: 'center', paddingVertical: 40 }}>No products found.</Muted> : null}
    </Screen>
  );
}
