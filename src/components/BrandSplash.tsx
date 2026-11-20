import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

// Plays the NFIL3D logo animation once per launch, on black (white mark on dark surface).
// Tap anywhere to skip.
const DURATION = 4800;

const SEEN_KEY = 'nfil3d-intro-seen';
// On web, play once per browser session so reloads and shared links open straight away.
const seenThisSession = () => Platform.OS === 'web' && typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SEEN_KEY) === '1';

export function BrandSplash({ onDone }: { onDone?: () => void }) {
  const [visible, setVisible] = useState(() => !seenThisSession());

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), DURATION);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (visible) return;
    if (Platform.OS === 'web') {
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {}
    }
    onDone?.();
  }, [visible, onDone]);

  if (!visible) return null;
  return (
    <Animated.View exiting={FadeOut.duration(250)} style={[StyleSheet.absoluteFill, styles.wrap]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Skip intro" onPress={() => setVisible(false)} style={styles.press}>
        <Image source={require('@/assets/images/splash.webp')} style={styles.anim} contentFit="contain" autoplay accessibilityLabel="NFIL3D logo animation" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: '#000', zIndex: 100 },
  press: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  anim: { width: 360, height: 360, maxWidth: '100%' },
});
