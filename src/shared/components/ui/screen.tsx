import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/lib/cn';

type Props = PropsWithChildren<{
  title: string;
  subtitle?: string;
  className?: string;
}>;

// Bottom edge is left to the tab bar, which already sits above the home indicator.
export function Screen({ title, subtitle, className, children }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <View className={cn('flex-1 px-6 pt-4', className)}>
        <Text accessibilityRole="header" variant="title">
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-1" variant="caption">
            {subtitle}
          </Text>
        ) : null}
        {children}
      </View>
    </SafeAreaView>
  );
}
