import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Group, IconButton, ListRow, Muted, Row, Screen } from '@/components/ui';
import { CAT, cleanModelName, Product, useCatalog } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { C, F, R, TILE } from '@/lib/theme';

type Feed = { key: string; label: string; match?: RegExp };

// Feeds first, then interest categories matched against the curated collection names.
const FEEDS: Feed[] = [
  { key: 'foryou', label: 'For you' },
  { key: 'trending', label: 'Trending' },
  { key: 'saved', label: 'Saved' },
];
const INTERESTS: Feed[] = [
  { key: 'rc', label: 'RC & vehicles', match: /rc |tank|construction|machinery/i },
  { key: 'lowpoly', label: 'Low poly', match: /low poly/i },
  { key: 'tests', label: 'Printer tests', match: /benchy/i },
  { key: 'paper', label: 'Papercraft', match: /origami|papercraft/i },
  { key: 'seasonal', label: 'Seasonal', match: /thanksgiving|christmas|diwali|halloween/i },
  { key: 'household', label: 'Household', match: /household|organi[sz]er|holder|hook/i },
  { key: 'toys', label: 'Toys & games', match: /toy|game|puzzle/i },
  { key: 'tools', label: 'Tools', match: /tool|clip|bracket/i },
];
const ALL = [...FEEDS, ...INTERESTS];

export default function Models() {
  const products = useCatalog();
  const { saved, toggleSaved, uploads } = useStore();
  const [feed, setFeed] = useState('foryou');
  const [q, setQ] = useState('');
  const [interestsOpen, setInterestsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const current = ALL.find((f) => f.key === feed)!;

  const list = useMemo(() => {
    let l = products.filter((p) => p.categories.includes(CAT.models));
    if (feed === 'trending') l = [...l].reverse();
    if (feed === 'saved') l = l.filter((m) => saved.includes(m.id));
    if (current.match) l = l.filter((m) => current.match!.test(m.name));
    const query = q.trim().toLowerCase();
    if (query) l = l.filter((m) => m.name.toLowerCase().includes(query));
    return l;
  }, [products, feed, saved, q, current]);

  const cols: Product[][] = [[], []];
  list.forEach((m, i) => cols[i % 2].push(m));

  // Top strip: the three feeds, plus the chosen interest when one is active.
  const strip = current.match ? [FEEDS[0], FEEDS[1], current] : FEEDS;

  const pick = (key: string) => {
    setFeed(key);
    setInterestsOpen(false);
  };

  return (
    <Screen>
      <Row style={{ gap: 8 }}>
        <IconButton icon="menu" label="Open menu" bg={C.white} onPress={() => setMenuOpen(true)} />
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, height: 42, paddingHorizontal: 14, borderRadius: 21, backgroundColor: C.cream }}>
          <Feather name="search" size={17} color={C.muted} />
          <TextInput value={q} onChangeText={setQ} placeholder="Search models" placeholderTextColor={C.muted} accessibilityLabel="Search models" style={{ flex: 1, fontFamily: F.body, fontSize: 15, height: 42 }} />
        </View>
        <IconButton icon="bell" label="Notifications" bg={C.white} />
      </Row>

      {interestsOpen ? (
        <View style={{ gap: 14 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Row style={{ gap: 8, alignItems: 'baseline' }}>
              <Text style={{ fontFamily: F.heading, fontSize: 17 }}>My interests</Text>
              <Muted>Tap to enter</Muted>
            </Row>
            <Pressable accessibilityRole="button" accessibilityLabel="Close interests" hitSlop={10} onPress={() => setInterestsOpen(false)}>
              <Feather name="chevron-up" size={22} />
            </Pressable>
          </Row>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {ALL.map((f) => {
              const on = f.key === feed;
              return (
                <Pressable
                  key={f.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  onPress={() => pick(f.key)}
                  style={{ height: 36, paddingHorizontal: 14, borderRadius: 10, justifyContent: 'center', backgroundColor: on ? C.mustard : C.cream }}>
                  <Text style={{ fontFamily: on ? F.label : F.body, fontSize: 14 }}>{f.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={{ fontFamily: F.heading, fontSize: 17, marginTop: 4 }}>Explore more</Text>
          <Group>
            <ListRow icon="box" tint={TILE.orange} label="3D models on nfil3d.com" onPress={() => WebBrowser.openBrowserAsync('https://nfil3d.com/product-category/3d-models/')} />
            <ListRow icon="upload" tint={TILE.green} label="Publish your model" onPress={() => router.push('/upload')} />
          </Group>
        </View>
      ) : (
        <Row style={{ marginTop: -4 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 22, paddingRight: 12 }} style={{ flex: 1 }}>
            {strip.map((t) => {
              const on = t.key === feed;
              return (
                <Pressable key={t.key} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setFeed(t.key)} style={{ paddingVertical: 8, alignItems: 'center' }}>
                  <Text style={{ fontFamily: on ? F.heading : F.body, fontSize: 16, color: on ? C.black : C.muted }}>{t.label}</Text>
                  <View style={{ height: 3, width: 20, borderRadius: 2, marginTop: 6, backgroundColor: on ? C.mustard : 'transparent' }} />
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable accessibilityRole="button" accessibilityLabel="Show all interests" hitSlop={10} onPress={() => setInterestsOpen(true)} style={{ paddingLeft: 8, paddingBottom: 8 }}>
            <Feather name="chevron-down" size={22} />
          </Pressable>
        </Row>
      )}

      {uploads.length && feed === 'foryou' ? <Muted>{uploads.length} of your uploads are in review.</Muted> : null}

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
        <View style={{ alignItems: 'center', gap: 12, paddingVertical: 50 }}>
          <Muted style={{ textAlign: 'center' }}>{feed === 'saved' ? 'Tap the heart on a model to save it here.' : `No ${current.label.toLowerCase()} models yet. New collections are added every week.`}</Muted>
          {feed !== 'foryou' ? (
            <Pressable accessibilityRole="button" onPress={() => setFeed('foryou')} style={{ height: 36, paddingHorizontal: 16, borderRadius: 18, backgroundColor: C.mustard, justifyContent: 'center' }}>
              <Text style={{ fontFamily: F.label, fontSize: 14 }}>Show all models</Text>
            </Pressable>
          ) : null}
        </View>
      )}

      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        go={(path) => {
          setMenuOpen(false);
          if (path === 'saved') setFeed('saved');
          else router.push(path as never);
        }}
      />
    </Screen>
  );
}

const MENU: { title: string; sub: string; icon: keyof typeof Feather.glyphMap; path: string }[] = [
  { title: 'Weekly quiz', sub: 'Score 5/5 to enter the prize draw', icon: 'award', path: '/quiz' },
  { title: 'Learning', sub: 'Guides from setup to first print', icon: 'book-open', path: '/learn' },
  { title: '3D pens for kids', sub: 'Pen kits, refills and stencils', icon: 'edit-3', path: '/shop?tab=pens' },
  { title: 'Publish a model', sub: 'Share your designs with makers', icon: 'upload', path: '/upload' },
  { title: 'My printer', sub: 'Pair a Mini-N, N1 or N2', icon: 'printer', path: '/devices' },
];

function SideMenu({ visible, onClose, go }: { visible: boolean; onClose: () => void; go: (path: string) => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <SafeAreaView edges={['top', 'bottom']} style={{ width: '82%', maxWidth: 380, backgroundColor: C.white }}>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
            <Row style={{ justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontFamily: F.heading, fontSize: 20 }}>Explore</Text>
              <IconButton icon="x" label="Close menu" onPress={onClose} />
            </Row>
            {MENU.map((m) => (
              <Pressable
                key={m.title}
                accessibilityRole="link"
                onPress={() => go(m.path)}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: R.lg, backgroundColor: C.cream, opacity: pressed ? 0.85 : 1 })}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontFamily: F.heading, fontSize: 16 }}>{m.title}</Text>
                  <Text style={{ fontFamily: F.body, fontSize: 13, lineHeight: 18, color: C.muted }}>{m.sub}</Text>
                </View>
                <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: C.mustard, alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name={m.icon} size={24} />
                </View>
              </Pressable>
            ))}
            <Group>
              <ListRow icon="heart" tint={TILE.pink} label="Saved models" onPress={() => go('saved')} />
              <ListRow icon="shopping-bag" tint={C.mustard} label="NFIL3D Store" onPress={() => go('/shop')} />
            </Group>
          </ScrollView>
        </SafeAreaView>
        <Pressable accessibilityRole="button" accessibilityLabel="Close menu" onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }} />
      </View>
    </Modal>
  );
}
