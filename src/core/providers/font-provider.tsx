import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { type PropsWithChildren, useEffect } from 'react';

// Keep the splash screen up until fonts are ready, so text never flashes in the
// system font and then jumps to Inter.
SplashScreen.preventAutoHideAsync();

export function FontProvider({ children }: PropsWithChildren) {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const ready = loaded || error !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // On a font error we still render, falling back to the system font.
  return ready ? children : null;
}
