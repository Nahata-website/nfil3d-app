import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { IconButton, Muted, Row, Screen } from '@/components/ui';
import { CAT, cleanModelName, Product, useCatalog } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { C, F, R } from '@/lib/theme';

const TABS = [
  { key: 'foryou', label: 'For you' },
  { key: 'trending', label: 'Trending' },
  { key: 'saved', label: 'Saved' },
] as const;
type Tab = (typeof TABS)[number]['key'];

export default function Models() {
  const products = useCatalog();
  const { saved, toggleSaved, uploads } = useStore();
  const [tab, setTab] = useState<Tab>('foryou');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    let l = products.filter((p) => p.categories.includes(CAT.models));
    if (tab === 'trending') l = [...l].reverse();
    if (tab === 'saved') l = l.filter((m) => saved.includes(m.id));
    const query = q.trim().toLowerCase();
    if (query) l = l.filter((m) => m.name.toLowerCase().includes(query));
    return l;
  }, [products, tab, saved, q]);

  // Two-column masonry: alternate tall and short tiles.
  const cols: Product[][] = [[], []];
  list.forEach((m, i) => cols[i % 2].push(m));

  return (
    <Screen>
      <Row style={{ gap: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, height: 42, paddingHorizontal: 14, borderRadius: 21, backgroundColor: C.cream }}>
          <Feather name="search" size={17} color={C.muted} />
          <TextInput value={q} onChangeText={setQ} placeholder="Search models" placeholderTextColor={C.muted} accessibilityLabel="Search models" style={{ flex: 1, fontFamily: F.body, fontSize: 15, height: 42 }} />
        </View>
        <IconButton icon="plus" label="Upload a model" bg={C.mustard} onPress={() => router.push('/upload')} />
      </Row>

      <Row style={{ gap: 22, marginTop: -4 }}>
        {TABS.map((t) => {
          const on = t.key === tab;
          return (
            <Pressable key={t.key} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setTab(t.key)} style={{ paddingVertical: 8, alignItems: 'center' }}>
              <Text style={{ fontFamily: on ? F.heading : F.body, fontSize: 16, color: on ? C.black : C.muted }}>{t.label}</Text>
              <View style={{ height: 3, width: 20, borderRadius: 2, marginTop: 6, backgroundColor: on ? C.mustard : 'transparent' }} />
            </Pressable>
          );
        })}
      </Row>

      {uploads.length && tab === 'foryou' ? <Muted>{uploads.length} of your uploads are in review.</Muted> : null}

      {list.length ? (
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          {cols.map((col, ci) => (
            <View key={ci} style={{ flex: 1, gap: 10 }}>
              {col.map((m, i) => {
                const tall = (i + ci) % 2 === 0;
                const isSaved = saved.includes(m.id);
                return (
                  <Pressable key={m.id} accessibilityRole="link" accessibilityLabel={cleanModelName(m.name)} onPress={() => router.push(`/model/${m.id}`)} style={({ pressed }) => ({ backgroundColor: C.cream, borderRadius: R.md, overflow: 'hidden', opacity: pressed ? 0.88 : 1 })}>
                    <Image source={m.images[0]} style={{ width: '100%', aspectRatio: tall ? 0.78 : 1 }} contentFit="cover" transition={150} />
                    <View style={{ padding: 10, gap: 8 }}>
                      <Text numberOfLines={2} style={{ fontFamily: F.label, fontSize: 13, lineHeight: 17 }}>
                        {cleanModelName(m.name)}
                      </Text>
                      <Row style={{ justifyContent: 'space-between' }}>
                        <Row style={{ gap: 6 }}>
                          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: C.mustard, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: F.heading, fontSize: 9 }}>N</Text>
                          </View>
                          <Text style={{ fontFamily: F.body, fontSize: 12, color: C.muted }}>NFIL3D</Text>
                        </Row>
                        <Pressable accessibilityRole="button" accessibilityLabel={isSaved ? 'Remove from saved' : 'Save model'} hitSlop={10} onPress={() => toggleSaved(m.id)}>
                          <Feather name="heart" size={16} color={isSaved ? C.danger : C.muted} />
                        </Pressable>
                      </Row>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      ) : (
        <Muted style={{ textAlign: 'center', paddingVertical: 50 }}>{tab === 'saved' ? 'Tap the heart on a model to save it here.' : 'No models found.'}</Muted>
      )}
      <Muted style={{ textAlign: 'center' }}>Free collections curated by NFIL3D. Community uploads appear after review.</Muted>
    </Screen>
  );
}
