import type { ConfigContext, ExpoConfig } from 'expo/config';

// Extends app.json. Values that depend on the Firebase / Google Cloud setup are
// read from environment variables (set them as EAS environment variables or in .env.local),
// so the app still builds before sign-in is configured.
export default ({ config }: ConfigContext): ExpoConfig => {
  const plugins = [...(config.plugins ?? [])];
  const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;
  if (iosUrlScheme) plugins.push(['@react-native-google-signin/google-signin', { iosUrlScheme }]);
  plugins.push('expo-apple-authentication');

  return {
    ...config,
    name: config.name ?? 'NFIL3D',
    slug: config.slug ?? 'nfil3d-app',
    owner: 'nfil3d',
    ios: { ...config.ios, usesAppleSignIn: true },
    plugins,
    extra: {
      ...config.extra,
      eas: { ...(config.extra?.eas ?? {}), projectId: '570f5437-0a3d-4fd0-92be-63ba4a79c17d' },
    },
  };
};
