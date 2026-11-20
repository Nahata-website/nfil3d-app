import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Body, H1, H2, Label, Muted, Screen } from '@/components/ui';
import { useCatalog } from '@/lib/catalog';
import { GUIDES } from '@/lib/content';
import { C, F, R } from '@/lib/theme';

export default function Learn() {
  const products = useCatalog();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Screen>
      <H1>Learn</H1>
      <Pressable accessibilityRole="button" onPress={() => router.push('/quiz')} style={{ backgroundColor: C.mustard, borderRadius: R.lg, padding: 20, gap: 6 }}>
        <Label>This week’s quiz</Label>
        <Text style={{ fontFamily: F.display, fontSize: 26, lineHeight: 30 }}>Filament basics</Text>
        <Body>Top scorers win nfil3d.com coupons or products.</Body>
        <View style={{ alignSelf: 'flex-start', marginTop: 8, backgroundColor: C.black, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 }}>
          <Text style={{ fontFamily: F.label, fontSize: 14, color: C.white }}>Start quiz</Text>
        </View>
      </Pressable>

      <H2>Guides</H2>
      <View>
        {GUIDES.map((g) => {
          const img = g.productMatch ? products.find((p) => g.productMatch!.test(p.name))?.images[0] : undefined;
          const expanded = open === g.id;
          return (
            <View key={g.id} style={{ borderBottomWidth: 1, borderBottomColor: C.divider }}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                onPress={() => setOpen(expanded ? null : g.id)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 }}>
                <View style={{ width: 60, height: 60, borderRadius: 14, backgroundColor: C.cream, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                  {img ? <Image source={img} style={{ width: 60, height: 60 }} contentFit="cover" /> : <Feather name="layers" size={22} />}
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={{ fontFamily: F.label, fontSize: 15 }}>{g.title}</Text>
                  <Muted>{g.meta}</Muted>
                </View>
                <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={C.muted} />
              </Pressable>
              {expanded ? (
                <View style={{ gap: 10, paddingBottom: 16, paddingLeft: 4 }}>
                  {g.steps.map((st, i) => (
                    <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
                      <Text style={{ fontFamily: F.heading, fontSize: 14, width: 18 }}>{i + 1}</Text>
                      <Body style={{ flex: 1, fontSize: 15, lineHeight: 22 }}>{st}</Body>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
