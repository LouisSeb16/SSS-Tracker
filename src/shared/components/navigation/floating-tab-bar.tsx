import type { Ionicons } from '@expo/vector-icons';
import { TabTrigger } from 'expo-router/ui';
import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabButton } from '@/shared/components/navigation/tab-button';

export type TabItem = {
  /** Must match the route file name inside the tabs folder. */
  name: string;
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
};

// A dark pill floating above the canvas. It sits in normal layout flow below the
// screens (not absolutely positioned), so content never needs a bottom inset hack.
export function FloatingTabBar({ items }: { items: TabItem[] }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="items-center bg-canvas px-6 pt-2"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      <View
        className="flex-row items-center gap-1 rounded-full bg-ink p-2"
        accessibilityRole="tablist"
      >
        {items.map((item) => (
          <TabTrigger asChild key={item.name} name={item.name}>
            <TabButton icon={item.icon} label={item.label} />
          </TabTrigger>
        ))}
      </View>
    </View>
  );
}
