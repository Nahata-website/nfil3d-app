import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button, H1, H2, Muted, Row, Screen } from '@/components/ui';
import { NFIL_PRINTERS, useCatalog } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { C, F, R } from '@/lib/theme';

export default function Devices() {
  const products = useCatalog();
  const { printer, printQueue } = useStore();
  const imgOf = (key: string) => products.find((p) => NFIL_PRINTERS.find((n) => n.key === key)!.match.test(p.name))?.images[0];
  const paired = NFIL_PRINTERS.find((p) => p.key === printer);

  return (
    <Screen>
      {paired ? (
        <>
          <View style={{ gap: 4 }}>
            <H1>My printer</H1>
            <Muted>Send models and track prints from your phone.</Muted>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push('/printer')} style={{ backgroundColor: C.mustard, borderRadius: R.xl, padding: 16, gap: 14 }}>
            <Row style={{ gap: 14 }}>
              <View style={{ width: 88, height: 88, borderRadius: 16, backgroundColor: C.white, overflow: 'hidden' }}>
                <Image source={imgOf(paired.key)} style={{ width: 88, height: 88 }} contentFit="contain" />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontFamily: F.heading, fontSize: 17 }}>{paired.name} 3D printer</Text>
                <Text style={{ fontFamily: F.label, fontSize: 12, color: C.success }}>● Paired</Text>
                <Muted style={{ color: C.black }}>{paired.spec}</Muted>
              </View>
              <Feather name="chevron-right" size={20} />
            </Row>
            <Row style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: 12, justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: F.body, fontSize: 14 }}>Print queue</Text>
              <Text style={{ fontFamily: F.label, fontSize: 14 }}>{printQueue.length ? `${printQueue.length} queued` : 'Empty'}</Text>
            </Row>
          </Pressable>
        </>
      ) : (
        <>
          <View style={{ gap: 4 }}>
            <H1>Add device</H1>
            <Muted>Pair your NFIL3D printer with the app.</Muted>
          </View>
          <View style={{ height: 300, borderRadius: R.xl, backgroundColor: C.cream, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Image source={imgOf('n2')} style={{ position: 'absolute', left: -10, bottom: 0, width: 230, height: 260 }} contentFit="contain" accessibilityLabel="NFIL3D N2 3D printer" />
            <View style={{ position: 'absolute', right: 24, top: 40, width: 128, height: 230, borderRadius: 26, backgroundColor: C.black, padding: 6 }}>
              <View style={{ flex: 1, borderRadius: 21, backgroundColor: '#1C1C1E', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ position: 'absolute', top: 8, width: 40, height: 10, borderRadius: 5, backgroundColor: C.black }} />
                <View style={{ width: 76, height: 76, alignItems: 'center', justifyContent: 'center' }}>
                  {[
                    { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
                    { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
                    { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
                    { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
                  ].map((c, i) => (
                    <View key={i} style={[{ position: 'absolute', width: 18, height: 18, borderColor: C.mustard, borderRadius: 3 }, c]} />
                  ))}
                  <Feather name="grid" size={34} color="#8E8E93" />
                  <View style={{ position: 'absolute', left: 6, right: 6, height: 2, backgroundColor: C.mustard }} />
                </View>
              </View>
            </View>
          </View>
          <Button title="Bind device" kind="buy" onPress={() => router.push('/printer')} />
          <Muted style={{ textAlign: 'center', marginTop: -8 }}>QR pairing turns on once printer Wi-Fi is confirmed. Until then, choose your model and send files by SD card or pendrive.</Muted>
        </>
      )}

      <View style={{ gap: 2, marginTop: 6 }}>
        <H2>Quick start guide</H2>
        <Muted>From setup to your first print</Muted>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }}>
        {NFIL_PRINTERS.map((p) => (
          <Pressable
            key={p.key}
            accessibilityRole="link"
            accessibilityLabel={`${p.name} quick start guide`}
            onPress={() => router.push('/learn')}
            style={({ pressed }) => ({ width: '48.5%', backgroundColor: C.cream, borderRadius: R.lg, padding: 12, alignItems: 'center', gap: 8, opacity: pressed ? 0.85 : 1 })}>
            <View style={{ width: '100%', aspectRatio: 1, borderRadius: 12, backgroundColor: C.white, overflow: 'hidden' }}>
              <Image source={imgOf(p.key)} style={{ width: '100%', height: '100%' }} contentFit="contain" />
            </View>
            <Text style={{ fontFamily: F.label, fontSize: 14 }}>{p.name} 3D printer</Text>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push('/learn')}
          style={({ pressed }) => ({ width: '48.5%', backgroundColor: C.cream, borderRadius: R.lg, padding: 12, alignItems: 'center', justifyContent: 'center', gap: 10, opacity: pressed ? 0.85 : 1 })}>
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: C.mustard, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="book-open" size={22} />
          </View>
          <Text style={{ fontFamily: F.label, fontSize: 14 }}>All guides</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
