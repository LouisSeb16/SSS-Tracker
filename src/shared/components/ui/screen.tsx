import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/lib/cn';

type Props = PropsWithChildren<{
  /** Second line of the heading, in ink. */
  title: string;
  /** First line of the heading, in the accent color. */
  accent?: string;
  subtitle?: string;
  className?: string;
}>;

// Bottom edge is left to the tab bar, which handles the home-indicator inset itself.
export function Screen({ title, accent, subtitle, className, children }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top', 'left', 'right']}>
      <View className={cn('flex-1 px-6 pt-4', className)}>
        <View
          accessible
          accessibilityLabel={accent ? `${accent} ${title}` : title}
          accessibilityRole="header"
        >
          {accent ? (
            <Text className="text-accent-text" variant="title">
              {accent}
            </Text>
          ) : null}
          <Text variant="title">{title}</Text>
        </View>
        {subtitle ? (
          <Text className="mt-2" variant="caption">
            {subtitle}
          </Text>
        ) : null}
        {children}
      </View>
    </SafeAreaView>
  );
}
