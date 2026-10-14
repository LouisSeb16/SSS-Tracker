import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps, Ref } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/lib/cn';
import { colors } from '@/shared/theme/colors';

type Props = TextInputProps & {
  /** Visible label above the field, also used as the accessibility label. */
  label?: string;
  /** Inline field error shown under the input. */
  error?: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  ref?: Ref<TextInput>;
};

export function Input({ label, error, icon, className, ref, ...rest }: Props) {
  return (
    <View className="gap-1">
      {label ? <Text variant="label">{label}</Text> : null}
      <View
        className={cn(
          'min-h-12 flex-row items-center gap-3 rounded-control border bg-surface px-4',
          error ? 'border-danger' : 'border-surface',
        )}
      >
        {icon ? <MaterialCommunityIcons color={colors.muted} name={icon} size={22} /> : null}
        <TextInput
          accessibilityLabel={label}
          className={cn('flex-1 py-3 font-inter text-base text-foreground', className)}
          placeholderTextColor={colors.muted}
          ref={ref}
          {...rest}
        />
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" className="text-danger" variant="caption">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
