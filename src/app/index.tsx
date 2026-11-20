import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { useStore } from '@/lib/store';

export default function Entry() {
  const { ready, onboarded } = useStore();
  if (!ready) return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  return <Redirect href={onboarded ? '/home' : '/welcome'} />;
}
