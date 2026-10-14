import { Ionicons } from '@expo/vector-icons';
import type { TabTriggerSlotProps } from 'expo-router/ui';
import type { ComponentProps, Ref } from 'react';
import { Pressable, type View } from 'react-native';

import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/lib/cn';

type Props = TabTriggerSlotProps & {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  ref?: Ref<View>;
};

// One item of the floating bar. Icon only when idle; the active item expands to show
// its label inside a lighter pill. The label is always the accessibility label.
export function TabButton({ label, icon, isFocused, className, ...rest }: Props) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!isFocused }}
      className={cn(
        'h-12 min-w-12 flex-row items-center justify-center gap-2 rounded-full px-3',
        isFocused ? 'bg-white/20 px-4' : 'active:bg-white/10',
        className as string | undefined,
      )}
      {...rest}
    >
      <Ionicons color="#FFFFFF" name={icon} size={22} />
      {isFocused ? (
        <Text className="font-sans-semibold text-sm text-white" variant="label">
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}
