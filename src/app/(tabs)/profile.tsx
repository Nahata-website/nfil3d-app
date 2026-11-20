import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Platform, Text, View } from 'react-native';

import { Button, Card, H1, ListRow, Muted, Row, Screen } from '@/components/ui';
import { NFIL_PRINTERS } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { C, F } from '@/lib/theme';

export default function Profile() {
  const { user, signOut, cart, printer, saved, uploads, quizPoints } = useStore();
  const paired = NFIL_PRINTERS.find((p) => p.key === printer);
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

  return (
    <Screen>
      <H1>Profile</H1>
      {user ? (
        <Row style={{ gap: 16 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.mustard, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: F.display, fontSize: 26 }}>{user.name.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: F.heading, fontSize: 20 }}>{user.name}</Text>
            <Muted>{user.contact}</Muted>
          </View>
        </Row>
      ) : (
        <Card bg={C.mustard} style={{ gap: 12 }}>
          <Text style={{ fontFamily: F.heading, fontSize: 18 }}>You’re browsing as a guest</Text>
          <Text style={{ fontFamily: F.body, fontSize: 14, lineHeight: 20 }}>Sign in to track orders, save models, join quizzes and pair your printer.</Text>
          <Button title="Sign in or create account" onPress={() => router.push('/welcome')} />
        </Card>
      )}

      <Row style={{ gap: 8 }}>
        <Stat n={saved.length} label="Saved" />
        <Stat n={uploads.length} label="Uploads" />
        <Stat n={quizPoints} label="Points" />
      </Row>

      <View>
        <ListRow icon="package" label="My orders" hint="nfil3d.com" onPress={() => open('/my-account/orders/')} />
        <ListRow icon="shopping-bag" label="Cart" hint={cart.length ? `${cart.length} ${cart.length === 1 ? "item" : "items"}` : undefined} onPress={() => router.push('/cart')} />
        <ListRow icon="printer" label="My printers" hint={paired ? `${paired.name} paired` : 'Pair'} onPress={() => router.push('/printer')} />
        <ListRow icon="award" label="Rewards and quiz" onPress={() => router.push('/quiz')} />
        <ListRow icon="map-pin" label="Addresses" onPress={() => open('/my-account/edit-address/')} />
        <ListRow icon="help-circle" label="Help and support" onPress={() => open('/contact/')} />
        <ListRow icon="shield" label="Privacy policy" onPress={() => open('/privacy-policy/')} />
        {user ? <ListRow icon="trash-2" label="Delete account" danger onPress={confirmDelete} /> : null}
      </View>
      {user ? <Button title="Log out" kind="ghost" onPress={signOut} /> : null}
      <Muted style={{ textAlign: 'center' }}>NFIL3D app · v1.0.0</Muted>
    </Screen>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: C.cream, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}>
      <Text style={{ fontFamily: F.heading, fontSize: 20 }}>{n}</Text>
      <Muted>{label}</Muted>
    </View>
  );
}
