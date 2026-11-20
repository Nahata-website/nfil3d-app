import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, Text, View } from 'react-native';

import { BackHeader, Body, Button, Muted, Row, Screen } from '@/components/ui';
import { checkoutUrl, getProduct, inr, useCatalog } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { C, F, R } from '@/lib/theme';

export default function Cart() {
  const products = useCatalog();
  const { cart, setQty } = useStore();
  const lines = cart.map((c) => ({ ...c, p: getProduct(products, c.id) })).filter((l) => l.p);
  const total = lines.reduce((a, l) => a + (l.p!.price ?? 0) * l.qty, 0);

  return (
    <Screen>
      <BackHeader title="Cart" />
      {!lines.length ? (
        <View style={{ alignItems: 'center', gap: 16, paddingVertical: 60 }}>
          <Feather name="shopping-bag" size={40} color={C.muted} />
          <Body>Your cart is empty.</Body>
          <Button title="Browse products" onPress={() => router.replace('/shop')} style={{ alignSelf: 'stretch' }} />
        </View>
      ) : (
        <>
          {lines.map(({ p, qty }) => (
            <Row key={p!.id} style={{ gap: 14, alignItems: 'flex-start' }}>
              <Image source={p!.images[0]} style={{ width: 80, height: 80, borderRadius: R.md, backgroundColor: C.cream }} contentFit="cover" />
              <View style={{ flex: 1, gap: 6 }}>
                <Text numberOfLines={2} style={{ fontFamily: F.label, fontSize: 14, lineHeight: 19 }}>
                  {p!.name}
                </Text>
                <Text style={{ fontFamily: F.body, fontSize: 14 }}>{inr((p!.price ?? 0) * qty)}</Text>
                <Row style={{ gap: 4 }}>
                  <QtyBtn icon="minus" label="Decrease quantity" onPress={() => setQty(p!.id, qty - 1)} />
                  <Text style={{ fontFamily: F.label, fontSize: 15, minWidth: 28, textAlign: 'center' }}>{qty}</Text>
                  <QtyBtn icon="plus" label="Increase quantity" onPress={() => setQty(p!.id, qty + 1)} />
                </Row>
              </View>
            </Row>
          ))}
          <View style={{ borderTopWidth: 1, borderTopColor: C.divider, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: F.heading, fontSize: 17 }}>
              Total <Text style={{ fontFamily: F.body, fontSize: 12, color: C.muted }}>incl. GST</Text>
            </Text>
            <Text style={{ fontFamily: F.heading, fontSize: 17 }}>{inr(total)}</Text>
          </View>
          <Button title="Checkout securely" kind="buy" icon="lock" onPress={() => WebBrowser.openBrowserAsync(checkoutUrl(cart))} />
          <Muted style={{ textAlign: 'center' }}>Payment, GST invoice and shipping are handled on nfil3d.com.</Muted>
        </>
      )}
    </Screen>
  );
}

function QtyBtn({ icon, label, onPress }: { icon: 'minus' | 'plus'; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
      <Feather name={icon} size={16} />
    </Pressable>
  );
}
