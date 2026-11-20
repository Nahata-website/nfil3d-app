import { router } from 'expo-router';
import { View } from 'react-native';

import { Body, Button, Display, Logo, Muted, Row, Screen } from '@/components/ui';
import { useStore } from '@/lib/store';
import { C } from '@/lib/theme';

export default function Welcome() {
  const { finishOnboarding } = useStore();

  // Google / Apple sign-in are wired to real providers in the auth phase (Firebase Auth).
  // In this build they create a local profile so the full flow can be tested.
  const social = (method: 'google' | 'apple' | 'email') => {
    finishOnboarding({ name: 'NFIL3D Maker', contact: method === 'email' ? 'email' : method, method });
    router.replace('/home');
  };

  return (
    <Screen bg={C.mustard}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Logo width={132} />
        <Button
          title="Skip"
          kind="cream"
          style={{ height: 44, borderRadius: 22 }}
          onPress={() => {
            finishOnboarding(null);
            router.replace('/home');
          }}
        />
      </Row>
      <View style={{ gap: 14, marginTop: 40, marginBottom: 28 }}>
        <Display>Make it.{'\n'}Print it.{'\n'}Share it.</Display>
        <Body>Find the right printer, filament or 3D pen, download free models and print from your phone.</Body>
      </View>
      <View style={{ gap: 10 }}>
        <Button title="Continue with mobile number" icon="smartphone" onPress={() => router.push('/otp')} />
        <Button title="Continue with Google" kind="outline" onPress={() => social('google')} />
        <Button title="Continue with Apple" kind="outline" onPress={() => social('apple')} />
        <Button title="Continue with email" kind="ghost" onPress={() => social('email')} />
        <Muted style={{ textAlign: 'center', color: C.black }}>By continuing you agree to the NFIL3D Terms and Privacy Policy.</Muted>
      </View>
    </Screen>
  );
}
