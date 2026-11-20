import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { C, F } from '@/lib/theme';

const icon = (name: keyof typeof Feather.glyphMap) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <Feather name={name} size={22} color={color as string} />;
  };

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.black,
        tabBarInactiveTintColor: '#6E6E73',
        tabBarLabelStyle: { fontFamily: F.label, fontSize: 10 },
        tabBarStyle: { backgroundColor: C.white, borderTopColor: C.divider },
      }}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: icon('home') }} />
      <Tabs.Screen name="shop" options={{ title: 'Shop', tabBarIcon: icon('shopping-bag') }} />
      <Tabs.Screen name="models" options={{ title: 'Models', tabBarIcon: icon('box') }} />
      <Tabs.Screen name="devices" options={{ title: 'Devices', tabBarIcon: icon('printer') }} />
      <Tabs.Screen name="me" options={{ title: 'Me', tabBarIcon: icon('user') }} />
    </Tabs>
  );
}
