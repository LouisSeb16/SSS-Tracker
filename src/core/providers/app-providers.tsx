import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FontProvider } from '@/core/providers/font-provider';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SafeAreaProvider>
      <FontProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </FontProvider>
    </SafeAreaProvider>
  );
}
