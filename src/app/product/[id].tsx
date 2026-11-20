import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { BackHeader, Body, Button, H1, IconButton, Muted, Row, Screen } from '@/components/ui';
import { checkoutUrl, getProduct, inr, useCatalog } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { C, F, MAX_W, R } from '@/lib/theme';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const products = useCatalog();
  const p = getProduct(products, Number(id));
  const { addToCart, cart } = useStore();
  const [added, setAdded] = useState(false);
  const [index, setIndex] = useState(0);
  const { width } = useWindowDimensions();
  const imgW = Math.min(width, MAX_W) - 40;
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  if (!p) {
    return (
      <Screen>
        <BackHeader />
        <Muted>This product is no longer available.</Muted>
      </Screen>
    );
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => setIndex(Math.round(e.nativeEvent.contentOffset.x / imgW));

  return (
    <Screen>
      <BackHeader right={<IconButton icon="shopping-bag" label="Cart" badge={cartCount} onPress={() => router.push('/cart')} />} />
      <View style={{ borderRadius: R.xl, overflow: 'hidden', backgroundColor: C.cream }}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onScroll} onScroll={onScroll} scrollEventThrottle={64}>
          {p.images.map((src) => (
            <Image key={src} source={src} style={{ width: imgW, height: imgW }} contentFit="contain" transition={150} accessibilityLabel={p.name} />
          ))}
        </ScrollView>
        {p.images.length > 1 ? (
          <Row style={{ position: 'absolute', bottom: 12, alignSelf: 'center', gap: 6 }}>
            {p.images.map((src, i) => (
              <View key={src} style={{ width: i === index ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: i === index ? C.black : '#00000040' }} />
            ))}
          </Row>
        ) : null}
      </View>

      <View style={{ gap: 8 }}>
        {p.onSale ? <Text style={{ fontFamily: F.label, fontSize: 12, color: C.burnt, letterSpacing: 0.6 }}>SALE</Text> : null}
        <H1 style={{ fontSize: 26, lineHeight: 32 }}>{p.name}</H1>
        <Row style={{ gap: 10, flexWrap: 'wrap' }}>
          <Text style={{ fontFamily: F.heading, fontSize: 22 }}>{inr(p.price)}</Text>
          {p.onSale && p.regularPrice && p.regularPrice > (p.price ?? 0) ? (
            <Text style={{ fontFamily: F.body, fontSize: 15, color: C.muted, textDecorationLine: 'line-through' }}>{inr(p.regularPrice)}</Text>
          ) : null}
          <Muted>incl. GST</Muted>
        </Row>
        <Text style={{ fontFamily: F.label, fontSize: 13, color: p.inStock ? C.success : C.danger }}>{p.inStock ? 'In stock' : 'Out of stock'}</Text>
      </View>

      <View style={{ gap: 10 }}>
        {p.hasOptions ? (
          <Button title="Select colour" kind="buy" onPress={() => WebBrowser.openBrowserAsync(p.url)} />
        ) : (
          <Row style={{ gap: 10 }}>
            <Button
              title={added ? 'Added' : 'Add to cart'}
              icon={added ? 'check' : 'shopping-bag'}
              kind="buy"
              disabled={!p.inStock}
              style={{ flex: 1 }}
              onPress={() => {
                addToCart(p.id);
                setAdded(true);
              }}
            />
            <Button title="Buy now" disabled={!p.inStock} style={{ flex: 1 }} onPress={() => WebBrowser.openBrowserAsync(checkoutUrl([{ id: p.id, qty: 1 }]))} />
          </Row>
        )}
      </View>

      {p.summary ? (
        <View style={{ backgroundColor: C.cream, borderRadius: R.lg, padding: 18, gap: 8 }}>
          <Text style={{ fontFamily: F.label, fontSize: 12, letterSpacing: 0.6 }}>SPECIFICATIONS</Text>
          {p.summary
            .split(/\n|\s\*\s|^\*\s/)
            .map((l) => l.replace(/^[*•-]\s*/, '').trim())
            .filter(Boolean)
            .slice(0, 12)
            .map((line, i) => (
              <Body key={i} style={{ fontSize: 15, lineHeight: 22 }}>
                {line}
              </Body>
            ))}
        </View>
      ) : null}

      <Button title="View full details on nfil3d.com" kind="outline" icon="external-link" onPress={() => WebBrowser.openBrowserAsync(p.url)} />
    </Screen>
  );
}
