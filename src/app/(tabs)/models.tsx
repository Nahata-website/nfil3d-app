import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ModelTile } from '@/components/ModelTile';
import { Button, Card, H1, Muted, Row, Screen } from '@/components/ui';
import { CAT, useCatalog } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { C, F } from '@/lib/theme';

export default function Models() {
  const products = useCatalog();
  const { uploads } = useStore();
  const [feed, setFeed] = useState<'foryou' | 'trending'>('foryou');
  const models = useMemo(() => {
    const list = products.filter((p) => p.categories.includes(CAT.models));
    return feed === 'trending' ? [...list].reverse() : list;
  }, [products, feed]);

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <H1>Models</H1>
        <Button title="Upload" icon="plus" style={{ height: 42, borderRadius: 21 }} onPress={() => router.push('/upload')} />
      </Row>
      <View style={{ flexDirection: 'row', backgroundColor: C.cream, borderRadius: 12, padding: 4 }}>
        {(['foryou', 'trending'] as const).map((k) => (
          <Pressable
            key={k}
            accessibilityRole="tab"
            accessibilityState={{ selected: feed === k }}
            onPress={() => setFeed(k)}
            style={{ flex: 1, height: 40, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: feed === k ? C.white : 'transparent' }}>
            <Text style={{ fontFamily: F.label, fontSize: 14 }}>{k === 'foryou' ? 'For you' : 'Trending'}</Text>
          </Pressable>
        ))}
      </View>

      {uploads.length ? (
        <Card>
          <Text style={{ fontFamily: F.label, fontSize: 14 }}>Your uploads</Text>
          {uploads.map((u) => (
            <Muted key={u.id} style={{ marginTop: 6 }}>
              {u.title} · In review
            </Muted>
          ))}
        </Card>
      ) : null}

      {models.map((m) => (
        <ModelTile key={m.id} m={m} height={300} />
      ))}
      <Muted style={{ textAlign: 'center' }}>Collections curated by NFIL3D. Community uploads appear here after review.</Muted>
    </Screen>
  );
}
