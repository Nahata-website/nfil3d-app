import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Platform, Pressable, Text, View } from 'react-native';

import { Group, IconButton, ListRow, Muted, Row, Screen } from '@/components/ui';
import { NFIL_PRINTERS, useCatalog } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { C, F, R } from '@/lib/theme';

export default function Me() {
  const products = useCatalog();
  const { user, signOut, printer, saved, uploads, quizPoints, printQueue } = useStore();
  const paired = NFIL_PRINTERS.find((p) => p.key === printer);
  const storeImg = products.find((p) => /^n1 3d printer/i.test(p.name))?.images[0];
  const open = (path: string) => WebBrowser.openBrowserAsync(`https://nfil3d.com${path}`);

  const confirmDelete = () => {
    const msg = 'Your profile, saved models and points will be deleted. Orders stay on nfil3d.com.';
    if (Platform.OS === 'web') {
      if (window.confirm(msg)) signOut();
    } else {
      Alert.alert('Delete account?', msg, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: signOut },
      ]);
    }
  };

  const quick: { icon: keyof typeof Feather.glyphMap; label: string; go: () => void }[] = [
    { icon: 'clock', label: 'Orders', go: () => open('/my-account/orders/') },
    { icon: 'list', label: 'Print queue', go: () => router.push('/printer') },
    { icon: 'heart', label: `Saved${saved.length ? ` (${saved.length})` : ''}`, go: () => router.push('/models') },
    { icon: 'award', label: `Points${quizPoints ? ` (${quizPoints})` : ''}`, go: () => router.push('/quiz') },
  ];

  return (
    <Screen>
      <Row style={{ justifyContent: 'flex-end', gap: 8 }}>
        <IconButton icon="maximize" label="Scan printer QR code" bg={C.white} onPress={() => router.push('/devices')} />
        <IconButton icon="bell" label="Notifications" bg={C.white} />
      </Row>

      <Pressable accessibilityRole="button" onPress={() => (user ? undefined : router.push('/welcome'))} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: C.mustard, alignItems: 'center', justifyContent: 'center' }}>
          {user ? <Text style={{ fontFamily: F.display, fontSize: 24 }}>{user.name.charAt(0)}</Text> : <Feather name="user" size={26} />}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontFamily: F.heading, fontSize: 20 }}>{user ? user.name : 'Sign in / Sign up'}</Text>
          {user ? <Muted>{user.contact}</Muted> : <Muted>Orders, saved models, quizzes and your printer</Muted>}
        </View>
        {!user ? <Feather name="chevron-right" size={20} color={C.muted} /> : null}
      </Pressable>

      <Group style={{ flexDirection: 'row', paddingVertical: 14 }}>
        {quick.map((q) => (
          <Pressable key={q.label} accessibilityRole="button" onPress={q.go} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
            <Feather name={q.icon} size={22} />
            <Text style={{ fontFamily: F.body, fontSize: 12, textAlign: 'center' }}>{q.label}</Text>
          </Pressable>
        ))}
      </Group>

      <Pressable accessibilityRole="link" onPress={() => router.push('/shop')} style={{ backgroundColor: C.mustard, borderRadius: R.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontFamily: F.heading, fontSize: 17 }}>NFIL3D Store</Text>
          <Text style={{ fontFamily: F.body, fontSize: 13, lineHeight: 18 }}>3D printers, filaments and 3D pens</Text>
        </View>
        {storeImg ? (
          <View style={{ width: 72, height: 72, borderRadius: 12, backgroundColor: C.white, overflow: 'hidden' }}>
            <Image source={storeImg} style={{ width: 72, height: 72 }} contentFit="contain" />
          </View>
        ) : null}
      </Pressable>

      <Group>
        <ListRow icon="printer" label="My printer" hint={paired ? `${paired.name} paired${printQueue.length ? ` · ${printQueue.length} queued` : ''}` : 'Pair'} onPress={() => router.push('/devices')} />
        <ListRow icon="disc" label="Filament library" onPress={() => router.push('/shop?tab=filaments')} />
        <ListRow icon="book-open" label="Learning" onPress={() => router.push('/learn')} />
        <ListRow icon="award" label="Weekly quiz" onPress={() => router.push('/quiz')} />
        <ListRow icon="upload" label="My uploads" hint={uploads.length ? String(uploads.length) : undefined} onPress={() => router.push('/upload')} />
      </Group>

      <Group>
        <ListRow icon="map-pin" label="Addresses" onPress={() => open('/my-account/edit-address/')} />
        <ListRow icon="help-circle" label="Support center" onPress={() => open('/contact/')} />
        <ListRow icon="shield" label="Privacy policy" onPress={() => open('/privacy-policy/')} />
        {user ? <ListRow icon="trash-2" label="Delete account" danger onPress={confirmDelete} /> : null}
        {user ? <ListRow icon="log-out" label="Log out" onPress={signOut} /> : null}
      </Group>
      <Muted style={{ textAlign: 'center' }}>NFIL3D app · v1.1</Muted>
    </Screen>
  );
}
