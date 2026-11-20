import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Text, View } from 'react-native';

import { BackHeader, Body, Button, Card, H1, IconButton, Muted, Row, Screen } from '@/components/ui';
import { cleanModelName, getProduct, inr, NFIL_PRINTERS, useCatalog } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { C, F, R } from '@/lib/theme';

export default function ModelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const products = useCatalog();
  const m = getProduct(products, Number(id));
  const { printer, queuePrint, saved, toggleSaved } = useStore();
  const paired = NFIL_PRINTERS.find((p) => p.key === printer);
  const rpla = products.find((p) => /rpla/i.test(p.name) && p.inStock && (p.price ?? 0) > 0);

  if (!m) {
    return (
      <Screen>
        <BackHeader />
        <Muted>This model is no longer available.</Muted>
      </Screen>
    );
  }
  const name = cleanModelName(m.name);
  const isSaved = saved.includes(m.id);

  return (
    <Screen>
      <BackHeader right={<IconButton icon="heart" label={isSaved ? 'Remove from saved' : 'Save model'} bg={isSaved ? C.mustard : C.cream} onPress={() => toggleSaved(m.id)} />} />
      <View style={{ borderRadius: R.xl, overflow: 'hidden', backgroundColor: C.cream, aspectRatio: 1 }}>
        <Image source={m.images[0]} style={{ width: '100%', height: '100%' }} contentFit="cover" accessibilityLabel={name} />
      </View>
      <View style={{ gap: 6 }}>
        <H1 style={{ fontSize: 26, lineHeight: 32 }}>{name}</H1>
        <Muted>Curated by NFIL3D · Free download</Muted>
      </View>
      {m.summary ? <Body numberOfLines={6}>{m.summary}</Body> : null}
      <Button
        title={paired ? `Send to ${paired.name}` : 'Print on my printer'}
        icon="printer"
        onPress={() => {
          if (paired) queuePrint(name);
          router.push('/printer');
        }}
      />
      <Button title="Get the STL files" kind="outline" icon="download" onPress={() => WebBrowser.openBrowserAsync(m.url)} />
      {rpla ? (
        <Card>
          <Row style={{ gap: 12 }}>
            <Image source={rpla.images[0]} style={{ width: 60, height: 60, borderRadius: 12 }} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Muted>Print it with</Muted>
              <Text numberOfLines={1} style={{ fontFamily: F.label, fontSize: 14 }}>
                {rpla.name}
              </Text>
              <Text style={{ fontFamily: F.body, fontSize: 13 }}>{inr(rpla.price)}</Text>
            </View>
            <Button title="View" kind="buy" style={{ height: 40, paddingHorizontal: 14 }} onPress={() => router.push(`/product/${rpla.id}`)} />
          </Row>
        </Card>
      ) : null}
    </Screen>
  );
}
