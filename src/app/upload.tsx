import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { BackHeader, Button, Label, Muted, Row, Screen } from '@/components/ui';
import { useStore } from '@/lib/store';
import { C, F, R } from '@/lib/theme';

// Upload storage + moderation queue connect to Supabase in Phase 2.
export default function Upload() {
  const { addUpload, user } = useStore();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const input = { borderWidth: 1, borderColor: C.divider, borderRadius: 14, paddingHorizontal: 16, fontFamily: F.body, fontSize: 15 } as const;

  return (
    <Screen>
      <BackHeader title="Publish a model" />
      <View style={{ height: 170, borderRadius: R.lg, borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.burnt, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Feather name="upload-cloud" size={30} />
        <Text style={{ fontFamily: F.label, fontSize: 15 }}>Add STL, 3MF or OBJ</Text>
        <Muted>Plus up to 6 photos of your print</Muted>
      </View>
      <View style={{ gap: 8 }}>
        <Label nativeID="t">Title</Label>
        <TextInput accessibilityLabelledBy="t" value={title} onChangeText={setTitle} placeholder="e.g. Desk cable organiser" placeholderTextColor={C.muted} style={[input, { height: 50 }]} />
      </View>
      <View style={{ gap: 8 }}>
        <Label nativeID="n">Print settings and notes</Label>
        <TextInput
          accessibilityLabelledBy="n"
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Material, layer height, supports…"
          placeholderTextColor={C.muted}
          style={[input, { height: 110, paddingTop: 14, textAlignVertical: 'top' }]}
        />
      </View>
      <Row style={{ justifyContent: 'space-between', backgroundColor: C.cream, borderRadius: 14, padding: 16 }}>
        <Text style={{ fontFamily: F.body, fontSize: 14 }}>Licence</Text>
        <Text style={{ fontFamily: F.label, fontSize: 14 }}>Free · personal use</Text>
      </Row>
      {!user ? <Muted>Sign in to publish. Your uploads are linked to your profile.</Muted> : null}
      <Button
        title={user ? 'Publish to community' : 'Sign in to publish'}
        disabled={!!user && title.trim().length < 3}
        onPress={() => {
          if (!user) return router.push('/welcome');
          addUpload({ title: title.trim(), notes });
          router.replace('/models');
        }}
      />
      <Muted style={{ textAlign: 'center' }}>Every upload is reviewed before it goes public.</Muted>
    </Screen>
  );
}
