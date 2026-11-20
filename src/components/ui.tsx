import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { C, F, MAX_W, R } from '@/lib/theme';

export const LOGO_BLACK = require('@/assets/images/logo-black.png');
export const LOGO_WHITE = require('@/assets/images/logo-white.png');

type TProps = TextProps & { style?: StyleProp<TextStyle> };
export const Display = (p: TProps) => <Text {...p} style={[s.display, p.style]} />;
export const H1 = (p: TProps) => <Text accessibilityRole="header" {...p} style={[s.h1, p.style]} />;
export const H2 = (p: TProps) => <Text accessibilityRole="header" {...p} style={[s.h2, p.style]} />;
export const Body = (p: TProps) => <Text {...p} style={[s.body, p.style]} />;
export const Muted = (p: TProps) => <Text {...p} style={[s.muted, p.style]} />;
export const Label = (p: TProps) => <Text {...p} style={[s.label, p.style]} />;

export function Screen({ children, scroll = true, padded = true, bg = C.white }: { children: ReactNode; scroll?: boolean; padded?: boolean; bg?: string }) {
  const inner = <View style={[s.column, padded && s.padded]}>{children}</View>;
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: bg }}>
      {scroll ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 40, alignItems: 'center' }} showsVerticalScrollIndicator={false}>
          {inner}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, alignItems: 'center' }}>{inner}</View>
      )}
    </SafeAreaView>
  );
}

export function Logo({ width = 132, white = false }: { width?: number; white?: boolean }) {
  // Brand minimum: 120 px digital.
  const w = Math.max(width, 120);
  return <Image source={white ? LOGO_WHITE : LOGO_BLACK} style={{ width: w, height: w * 0.453 }} contentFit="contain" accessibilityLabel="NFIL3D" />;
}

type BtnKind = 'primary' | 'buy' | 'outline' | 'ghost' | 'cream';
export function Button({
  title,
  onPress,
  kind = 'primary',
  icon,
  disabled,
  loading,
  style,
}: {
  title: string;
  onPress?: () => void;
  kind?: BtnKind;
  icon?: keyof typeof Feather.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const bg = { primary: C.black, buy: C.orange, outline: C.white, ghost: 'transparent', cream: C.cream }[kind];
  const fg = kind === 'primary' ? C.white : C.black;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        kind === 'outline' && { borderWidth: 1.5, borderColor: C.black },
        kind === 'ghost' && { height: 44 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <Feather name={icon} size={18} color={fg} /> : null}
          <Text style={[s.btnText, { color: fg }, kind === 'ghost' && { textDecorationLine: 'underline', fontFamily: F.label }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

export function IconButton({ icon, label, onPress, badge, bg = C.cream }: { icon: keyof typeof Feather.glyphMap; label: string; onPress?: () => void; badge?: number; bg?: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={6} style={[s.iconBtn, { backgroundColor: bg }]}>
      <Feather name={icon} size={20} color={C.black} />
      {badge ? (
        <View style={s.badge}>
          <Text style={s.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export function BackHeader({ title, right }: { title?: string; right?: ReactNode }) {
  return (
    <View style={s.backHeader}>
      <IconButton icon="chevron-left" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      {title ? <H2 style={{ flex: 1 }} numberOfLines={1}>{title}</H2> : <View style={{ flex: 1 }} />}
      {right}
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      style={[s.chip, { backgroundColor: active ? C.black : C.cream }]}>
      <Text style={[s.chipText, { color: active ? C.white : C.black }]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, style, bg = C.cream }: { children: ReactNode; style?: StyleProp<ViewStyle>; bg?: string }) {
  return <View style={[{ backgroundColor: bg, borderRadius: R.lg, padding: 18 }, style]}>{children}</View>;
}

export function Group({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ backgroundColor: C.cream, borderRadius: R.lg, overflow: 'hidden' }, style]}>{children}</View>;
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>;
}

export function ListRow({ label, hint, onPress, icon, danger }: { label: string; hint?: string; onPress?: () => void; icon?: keyof typeof Feather.glyphMap; danger?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s.listRow, pressed && { opacity: 0.7 }]}>
      {icon ? <Feather name={icon} size={20} color={danger ? C.danger : C.black} /> : null}
      <Text style={[s.listLabel, danger && { color: C.danger }]}>{label}</Text>
      {hint ? <Text style={s.listHint}>{hint}</Text> : null}
      <Feather name="chevron-right" size={18} color={C.muted} />
    </Pressable>
  );
}

export const s = StyleSheet.create({
  column: { width: '100%', maxWidth: MAX_W },
  padded: { paddingHorizontal: 16, gap: 18, paddingTop: 10 },
  display: { fontFamily: F.display, fontSize: 32, lineHeight: 35, color: C.black, letterSpacing: -0.7 },
  h1: { fontFamily: F.heading, fontSize: 24, lineHeight: 30, color: C.black, letterSpacing: -0.35 },
  h2: { fontFamily: F.label, fontSize: 17, lineHeight: 22, color: C.black, letterSpacing: -0.2 },
  body: { fontFamily: F.body, fontSize: 15, lineHeight: 21, color: C.black },
  muted: { fontFamily: F.body, fontSize: 13, lineHeight: 18, color: C.muted, letterSpacing: 0.1 },
  label: { fontFamily: F.label, fontSize: 11, letterSpacing: 0.7, color: C.black, textTransform: 'uppercase' },
  btn: { height: 50, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 18 },
  btnText: { fontFamily: F.label, fontSize: 15 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 2, right: 2, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.orange, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { fontFamily: F.heading, fontSize: 11, color: C.black },
  backHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chip: { height: 34, paddingHorizontal: 14, borderRadius: 17, justifyContent: 'center' },
  chipText: { fontFamily: F.label, fontSize: 13 },
  listRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.divider },
  listLabel: { flex: 1, fontFamily: F.body, fontSize: 15, color: C.black },
  listHint: { fontFamily: F.body, fontSize: 13, color: C.muted },
});
