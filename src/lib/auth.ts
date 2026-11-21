// Real sign-in with Firebase Authentication: Google (web + Android + iOS) and Apple (web + iOS).
// Configured through EXPO_PUBLIC_* variables (see .env.example). Until they are set,
// `authReady` is false and the welcome screen shows sign-in as "being set up".
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  GoogleAuthProvider,
  OAuthProvider,
  User as FirebaseUser,
  getAuth,
  initializeAuth,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signOut as fbSignOut,
  // @ts-expect-error: exported by Firebase's React Native build, not in the web type definitions
  getReactNativePersistence,
} from 'firebase/auth';
import { Platform } from 'react-native';

// Firebase web config is public by design (it identifies the project; security comes from
// Authorised domains and Auth rules). EXPO_PUBLIC_* variables override these defaults.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBnUKyyHx--4u4evp7BzPM4afNHc8wIBnI',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'nfil3d-7feb3.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'nfil3d-7feb3',
  storageBucket: 'nfil3d-7feb3.firebasestorage.app',
  messagingSenderId: '184311361939',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:184311361939:web:3e9a787816fb6af8437866',
};
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

export const authReady = !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
export const googleReady = authReady && (Platform.OS === 'web' || !!GOOGLE_WEB_CLIENT_ID);
// Apple: iOS app and web. Not offered on Android (Apple does not require it there).
export const appleAvailable = authReady && (Platform.OS === 'ios' || Platform.OS === 'web');

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function getFirebaseAuth(): Auth {
  if (!authReady) throw new Error('Sign-in is not configured yet.');
  if (auth) return auth;
  app = getApps()[0] ?? initializeApp(firebaseConfig);
  auth =
    Platform.OS === 'web'
      ? getAuth(app)
      : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  return auth;
}

export type AppUser = { name: string; contact: string; method: 'google' | 'apple' };

function toAppUser(u: FirebaseUser): AppUser {
  const method = u.providerData.some((p) => p.providerId === 'apple.com') ? 'apple' : 'google';
  return { name: u.displayName || u.email?.split('@')[0] || 'NFIL3D Maker', contact: u.email || '', method };
}

export async function signInWithGoogle(): Promise<AppUser> {
  const a = getFirebaseAuth();
  if (Platform.OS === 'web') {
    const res = await signInWithPopup(a, new GoogleAuthProvider());
    return toAppUser(res.user);
  }
  // Native module: only present in EAS builds, not in Expo Go.
  const { GoogleSignin, isSuccessResponse } = await import('@react-native-google-signin/google-signin');
  GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const res = await GoogleSignin.signIn();
  if (!isSuccessResponse(res) || !res.data.idToken) throw new Error('Google sign-in was cancelled.');
  const cred = GoogleAuthProvider.credential(res.data.idToken);
  const out = await signInWithCredential(a, cred);
  return toAppUser(out.user);
}

export async function signInWithApple(): Promise<AppUser> {
  const a = getFirebaseAuth();
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  if (Platform.OS === 'web') {
    const res = await signInWithPopup(a, provider);
    return toAppUser(res.user);
  }
  const AppleAuthentication = await import('expo-apple-authentication');
  const Crypto = await import('expo-crypto');
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
  const apple = await AppleAuthentication.signInAsync({
    requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
    nonce: hashedNonce,
  });
  if (!apple.identityToken) throw new Error('Apple sign-in was cancelled.');
  const out = await signInWithCredential(a, provider.credential({ idToken: apple.identityToken, rawNonce }));
  const user = toAppUser(out.user);
  // Apple shares the name only on the first sign-in.
  const given = [apple.fullName?.givenName, apple.fullName?.familyName].filter(Boolean).join(' ');
  return given ? { ...user, name: given } : user;
}

export async function signOutEverywhere() {
  if (!authReady) return;
  await fbSignOut(getFirebaseAuth()).catch(() => {});
  if (Platform.OS !== 'web') {
    try {
      const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
      await GoogleSignin.signOut();
    } catch {
      // Not available in Expo Go, or not signed in with Google.
    }
  }
}

export function watchAuth(cb: (u: AppUser | null) => void) {
  if (!authReady) return () => {};
  return onAuthStateChanged(getFirebaseAuth(), (u) => cb(u ? toAppUser(u) : null));
}

export function friendlyAuthError(e: unknown): string {
  const code = (e as { code?: string })?.code ?? '';
  if (code.includes('popup-closed') || code.includes('cancel') || /cancel/i.test(String(e))) return 'Sign-in was cancelled.';
  if (code.includes('network')) return 'No internet connection. Try again.';
  if (code.includes('unauthorized-domain')) return 'This website is not yet allowed in Firebase (Authorised domains).';
  if (/RNGoogleSignin|native module/i.test(String(e))) return 'Google sign-in works in the installed app, not in Expo Go.';
  return 'Sign-in failed. Please try again.';
}
