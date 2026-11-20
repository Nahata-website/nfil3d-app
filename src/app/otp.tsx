import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { BackHeader, Body, Button, H1, Label, Muted, Row, Screen } from '@/components/ui';
import { useStore } from '@/lib/store';
import { C, F } from '@/lib/theme';

// OTP UI is complete; SMS delivery plugs into Firebase Phone Auth in the auth phase.
export default function Otp() {
  const { finishOnboarding } = useStore();
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const validPhone = /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));

  return (
    <Screen>
      <BackHeader />
      <View style={{ gap: 6 }}>
        <H1>Your mobile number</H1>
        <Muted>We’ll send a 6-digit code by SMS.</Muted>
      </View>
      <View style={{ gap: 8 }}>
        <Label nativeID="phoneLabel">Mobile number</Label>
        <Row style={{ gap: 10 }}>
          <View style={{ height: 54, paddingHorizontal: 14, borderRadius: 14, backgroundColor: C.cream, justifyContent: 'center' }}>
            <Text style={{ fontFamily: F.label, fontSize: 16 }}>+91</Text>
          </View>
          <TextInput
            accessibilityLabelledBy="phoneLabel"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={11}
            placeholder="98765 43210"
            placeholderTextColor={C.muted}
            style={{ flex: 1, height: 54, borderRadius: 14, borderWidth: 1, borderColor: C.divider, paddingHorizontal: 16, fontFamily: F.body, fontSize: 16 }}
          />
        </Row>
      </View>
      {sent ? (
        <View style={{ gap: 8 }}>
          <Label nativeID="codeLabel">Verification code</Label>
          <TextInput
            accessibilityLabelledBy="codeLabel"
            value={code}
            onChangeText={(t) => setCode(t.replace(/\D/g, ''))}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="••••••"
            placeholderTextColor={C.muted}
            style={{ height: 54, borderRadius: 14, borderWidth: 1, borderColor: C.divider, paddingHorizontal: 16, fontFamily: F.heading, fontSize: 22, letterSpacing: 8 }}
          />
          <Muted>Test build: enter any 6 digits.</Muted>
        </View>
      ) : null}
      {!sent ? (
        <Button title="Send code" disabled={!validPhone} onPress={() => setSent(true)} />
      ) : (
        <Button
          title="Verify and continue"
          disabled={code.length !== 6}
          onPress={() => {
            finishOnboarding({ name: 'NFIL3D Maker', contact: `+91 ${phone}`, method: 'phone' });
            router.replace('/home');
          }}
        />
      )}
      <Body style={{ fontSize: 13, color: C.muted }}>Your number is only used to sign in and send order updates.</Body>
    </Screen>
  );
}
