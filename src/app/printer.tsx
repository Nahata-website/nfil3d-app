import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BackHeader, Button, Card, Muted, Row, Screen } from '@/components/ui';
import { NFIL_PRINTERS, useCatalog } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { C, F, R } from '@/lib/theme';

export default function Printer() {
  const products = useCatalog();
  const { printer, pairPrinter, printQueue } = useStore();
  const [pick, setPick] = useState<string>('n2');
  const imgOf = (key: string) => products.find((p) => NFIL_PRINTERS.find((n) => n.key === key)!.match.test(p.name))?.images[0];
  const paired = NFIL_PRINTERS.find((p) => p.key === printer);

  return (
    <Screen>
      <BackHeader title="My printers" />
      {paired ? (
        <Card style={{ gap: 14 }}>
          <Row style={{ gap: 14 }}>
            <Image source={imgOf(paired.key)} style={{ width: 96, height: 96, borderRadius: 14, backgroundColor: C.white }} contentFit="contain" />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontFamily: F.heading, fontSize: 20 }}>{paired.name} 3D printer</Text>
              <Text style={{ fontFamily: F.label, fontSize: 13, color: C.success }}>● Paired</Text>
              <Muted>{paired.spec}</Muted>
            </View>
          </Row>
          <View style={{ backgroundColor: C.white, borderRadius: 14, padding: 14, gap: 6 }}>
            <Text style={{ fontFamily: F.label, fontSize: 14 }}>Print queue</Text>
            {printQueue.length ? printQueue.map((t, i) => <Muted key={i}>{i + 1}. {t}</Muted>) : <Muted>Empty. Open a model and tap “Send to printer”.</Muted>}
          </View>
          <Button title="Remove printer" kind="outline" onPress={() => pairPrinter(null)} />
        </Card>
      ) : (
        <>
          <Muted>Choose your NFIL3D printer to pair it with the app.</Muted>
          <View style={{ gap: 10 }}>
            {NFIL_PRINTERS.map((p) => (
              <Pressable
                key={p.key}
                accessibilityRole="radio"
                accessibilityState={{ checked: pick === p.key }}
                onPress={() => setPick(p.key)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 10, borderRadius: R.lg, borderWidth: 2, borderColor: pick === p.key ? C.black : C.divider }}>
                <Image source={imgOf(p.key)} style={{ width: 72, height: 72, borderRadius: 14, backgroundColor: C.cream }} contentFit="contain" />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: F.heading, fontSize: 17 }}>{p.name}</Text>
                  <Muted>{p.spec}</Muted>
                </View>
              </Pressable>
            ))}
          </View>
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: F.label, fontSize: 12, letterSpacing: 0.6 }}>CONNECTION</Text>
            <Status label="Wi-Fi pairing" tag="To confirm" warn />
            <Status label="SD card / pendrive file transfer" tag="Works today" />
          </View>
          <Button title={`Pair ${NFIL_PRINTERS.find((p) => p.key === pick)!.name}`} onPress={() => pairPrinter(pick)} />
        </>
      )}
    </Screen>
  );
}

function Status({ label, tag, warn }: { label: string; tag: string; warn?: boolean }) {
  return (
    <Row style={{ justifyContent: 'space-between', backgroundColor: C.cream, borderRadius: 14, padding: 14 }}>
      <Text style={{ fontFamily: F.body, fontSize: 14, flex: 1 }}>{label}</Text>
      <Text style={{ fontFamily: F.label, fontSize: 11, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden', backgroundColor: warn ? C.sand : '#E6F4EA', color: warn ? C.burnt : C.success }}>
        {tag.toUpperCase()}
      </Text>
    </Row>
  );
}
