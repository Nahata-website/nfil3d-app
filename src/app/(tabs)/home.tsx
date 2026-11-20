import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ModelTile } from '@/components/ModelTile';
import { ProductCard } from '@/components/ProductCard';
import { Body, Display, H2, IconButton, Label, Logo, Muted, Row, Screen } from '@/components/ui';
import { CAT, inr, NFIL_PRINTERS, useCatalog } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { C, F, R } from '@/lib/theme';

const BEST_FILAMENT = 136;

export default function Home() {
  const products = useCatalog();
  const { user, cart, printer } = useStore();
  const n2 = products.find((p) => NFIL_PRINTERS[2].match.test(p.name));
  const models = products.filter((p) => p.categories.includes(CAT.models));
  const filaments = products.filter((p) => p.categories.includes(BEST_FILAMENT) && p.images.length).slice(0, 8);
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);
  const paired = NFIL_PRINTERS.find((p) => p.key === printer);

  const actions: { icon: keyof typeof Feather.glyphMap; label: string; go: string }[] = [
    { icon: 'printer', label: paired ? paired.name : 'My printer', go: '/devices' },
    { icon: 'book-open', label: 'Guides', go: '/learn' },
    { icon: 'award', label: 'Quiz', go: '/quiz' },
    { icon: 'upload', label: 'Upload', go: '/upload' },
  ];

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <Logo width={120} />
        <Row style={{ gap: 8 }}>
          <IconButton icon="search" label="Search" onPress={() => router.push('/shop')} />
          <IconButton icon="shopping-bag" label="Cart" badge={cartCount} onPress={() => router.push('/cart')} />
        </Row>
      </Row>

      <View style={{ gap: 4 }}>
        <Muted>{user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome to NFIL3D'}</Muted>
        <Display style={{ fontSize: 28, lineHeight: 31 }}>What will you make today?</Display>
      </View>

      {n2 ? (
        <Pressable accessibilityRole="link" onPress={() => router.push(`/product/${n2.id}`)} style={{ backgroundColor: C.mustard, borderRadius: R.xl, padding: 22, paddingBottom: 0, overflow: 'hidden' }}>
          <Label>N2 3D printer</Label>
          <Text style={{ fontFamily: F.display, fontSize: 26, lineHeight: 29, marginTop: 6, color: C.black }}>Print up to{'\n'}250 × 250 × 300 mm</Text>
          <Body style={{ marginTop: 6 }}>
            {inr(n2.price)} <Text style={{ fontSize: 12 }}>incl. GST</Text>
          </Body>
          <Row style={{ marginTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: F.label, fontSize: 15, textDecorationLine: 'underline' }}>View specifications</Text>
            <Feather name="arrow-right" size={16} />
          </Row>
          <View style={{ backgroundColor: C.white, borderRadius: R.lg, marginTop: 16, marginBottom: 18, overflow: 'hidden' }}>
            <Image source={n2.images[0]} style={{ width: '100%', height: 260 }} contentFit="contain" accessibilityLabel="N2 3D Printer" />
          </View>
        </Pressable>
      ) : null}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {actions.map((a) => (
          <Pressable key={a.label} accessibilityRole="button" onPress={() => router.push(a.go as never)} style={{ alignItems: 'center', gap: 8, width: '24%' }}>
            <View style={{ width: 62, height: 62, borderRadius: 20, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name={a.icon} size={24} color={C.black} />
            </View>
            <Text style={{ fontFamily: F.label, fontSize: 12, color: C.black }}>{a.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable accessibilityRole="button" onPress={() => router.push('/quiz')} style={{ backgroundColor: C.mustard, borderRadius: R.lg, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Label>Weekly quiz</Label>
          <Text style={{ fontFamily: F.heading, fontSize: 16, lineHeight: 22, color: C.black }}>Answer 5 questions. Win coupons and products from nfil3d.com.</Text>
        </View>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.black, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="arrow-right" size={20} color={C.mustard} />
        </View>
      </Pressable>

      <Section title="Trending models" onAll={() => router.push('/models')}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }} style={{ marginHorizontal: -20 }}>
          {models.map((m) => (
            <ModelTile key={m.id} m={m} width={160} />
          ))}
        </ScrollView>
      </Section>

      <Section title="Best-selling filaments" onAll={() => router.push('/shop?tab=filaments')}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }} style={{ marginHorizontal: -20 }}>
          {filaments.map((p) => (
            <ProductCard key={p.id} p={p} width={160} />
          ))}
        </ScrollView>
      </Section>
    </Screen>
  );
}

function Section({ title, onAll, children }: { title: string; onAll: () => void; children: React.ReactNode }) {
  return (
    <View style={{ gap: 12 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <H2>{title}</H2>
        <Pressable accessibilityRole="link" onPress={onAll} hitSlop={10}>
          <Text style={{ fontFamily: F.label, fontSize: 14 }}>See all</Text>
        </Pressable>
      </Row>
      {children}
    </View>
  );
}
