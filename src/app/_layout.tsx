import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { InterTight_900Black } from '@expo-google-fonts/inter-tight';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BrandSplash } from '@/components/BrandSplash';
import { StoreProvider } from '@/lib/store';
import { C } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold, InterTight_900Black });
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: '#000' }} />;

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style={introDone ? 'dark' : 'light'} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.white } }} />
        {!introDone ? <BrandSplash onDone={() => setIntroDone(true)} /> : null}
      </StoreProvider>
    </SafeAreaProvider>
  );
}
