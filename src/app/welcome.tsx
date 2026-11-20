import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Text, View } from 'react-native';

import { Body, Button, Display, Logo, Muted, Row, Screen } from '@/components/ui';
import { appleAvailable, authReady, friendlyAuthError, googleReady, signInWithApple, signInWithGoogle } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { C, F } from '@/lib/theme';

export default function Welcome() {
  const { finishOnboarding } = useStore();
  const [busy, setBusy] = useState<'google' | 'apple' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (method: 'google' | 'apple') => {
    setError(null);
    setBusy(method);
    try {
      const user = method === 'google' ? await signInWithGoogle() : await signInWithApple();
      finishOnboarding(user);
      router.replace('/home');
    } catch (e) {
      setError(friendlyAuthError(e));
    } finally {
      setBusy(null);
    }
  };

  const skip = () => {
    finishOnboarding(null);
    router.replace('/home');
  };

  return (
    <Screen bg={C.mustard}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Logo width={132} />
        <Button title="Skip" kind="cream" style={{ height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)' }} onPress={skip} />
      </Row>
      <View style={{ gap: 14, marginTop: 40, marginBottom: 28 }}>
        <Display>Make it.{'\n'}Print it.{'\n'}Share it.</Display>
        <Body>Find the right printer, filament or 3D pen, download free models and print from your phone.</Body>
      </View>
      <View style={{ gap: 10 }}>
        <Button
          title="Continue with Google"
          kind="primary"
          loading={busy === 'google'}
          disabled={!googleReady || !!busy}
          onPress={() => run('google')}
        />
        {appleAvailable || (!authReady && Platform.OS !== 'android') ? (
          <Button title="Continue with Apple" kind="outline" loading={busy === 'apple'} disabled={!appleAvailable || !!busy} onPress={() => run('apple')} />
        ) : null}
        {error ? <Text style={{ fontFamily: F.label, fontSize: 13, color: C.danger, textAlign: 'center' }}>{error}</Text> : null}
        {!authReady ? (
          <Muted style={{ textAlign: 'center', color: C.black }}>Sign-in is being set up. Tap Skip to browse, shop and play the quiz as a guest.</Muted>
        ) : null}
        <Button title="Continue as guest" kind="ghost" onPress={skip} />
        <Muted style={{ textAlign: 'center', color: C.black }}>By continuing you agree to the NFIL3D Terms and Privacy Policy.</Muted>
      </View>
    </Screen>
  );
}
