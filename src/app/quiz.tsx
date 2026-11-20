import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BackHeader, Body, Button, Card, Display, H1, Label, Muted, Screen } from '@/components/ui';
import { QUIZ } from '@/lib/content';
import { useStore } from '@/lib/store';
import { C, F } from '@/lib/theme';

export default function Quiz() {
  const { addPoints, user } = useStore();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= QUIZ.length;
  const q = QUIZ[Math.min(i, QUIZ.length - 1)];

  if (done) {
    return (
      <Screen>
        <BackHeader />
        <View style={{ gap: 10, marginTop: 20 }}>
          <Label>Filament basics</Label>
          <Display>
            {score} / {QUIZ.length}
          </Display>
          <Body>{score === QUIZ.length ? 'Perfect score. You’re in this week’s prize draw.' : 'Nice work. Play again next week for another chance to win.'}</Body>
        </View>
        <Card>
          <Text style={{ fontFamily: F.label, fontSize: 15 }}>+{score * 20} points</Text>
          <Muted>{user ? 'Points are saved to your profile.' : 'Sign in to keep your points and claim prizes.'}</Muted>
        </Card>
        <Button title="Back to Learn" onPress={() => router.replace('/learn')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader
        right={
          <Text style={{ fontFamily: F.label, fontSize: 14, color: C.muted }}>
            {i + 1} / {QUIZ.length}
          </Text>
        }
      />
      <View style={{ height: 6, borderRadius: 3, backgroundColor: C.cream }}>
        <View style={{ width: `${((i + (picked !== null ? 1 : 0)) / QUIZ.length) * 100}%`, height: 6, borderRadius: 3, backgroundColor: C.black }} />
      </View>
      <H1 style={{ fontSize: 26, lineHeight: 32 }}>{q.q}</H1>
      <View style={{ gap: 10 }}>
        {q.options.map((o, k) => {
          const isRight = picked !== null && k === q.answer;
          const isWrong = picked === k && k !== q.answer;
          return (
            <Pressable
              key={o}
              accessibilityRole="button"
              disabled={picked !== null}
              onPress={() => {
                setPicked(k);
                if (k === q.answer) setScore((s) => s + 1);
              }}
              style={{
                minHeight: 58,
                borderRadius: 16,
                paddingHorizontal: 18,
                borderWidth: 2,
                borderColor: isRight ? C.success : isWrong ? C.danger : C.divider,
                backgroundColor: isRight ? '#E6F4EA' : isWrong ? '#FDECEA' : C.white,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{ fontFamily: F.label, fontSize: 16 }}>{o}</Text>
              {isRight ? <Text style={{ fontFamily: F.label, fontSize: 13, color: C.success }}>Correct</Text> : null}
              {isWrong ? <Text style={{ fontFamily: F.label, fontSize: 13, color: C.danger }}>Not quite</Text> : null}
            </Pressable>
          );
        })}
      </View>
      {picked !== null ? (
        <>
          <Card>
            <Body style={{ fontSize: 15 }}>{q.why}</Body>
          </Card>
          <Button
            title={i === QUIZ.length - 1 ? 'See results' : 'Next question'}
            onPress={() => {
              if (i === QUIZ.length - 1) addPoints((score + 0) * 20);
              setPicked(null);
              setI(i + 1);
            }}
          />
        </>
      ) : null}
    </Screen>
  );
}
