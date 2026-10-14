import { Ionicons } from '@expo/vector-icons';
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
  icon?: ComponentProps<typeof Ionicons>['name'];
  /** Classes for the outer wrapper (margins, width). `className` styles the text field. */
  containerClassName?: string;
  ref?: Ref<TextInput>;
};

export function Input({ label, error, icon, containerClassName, className, ref, ...rest }: Props) {
  return (
    <View className={cn('gap-1.5', containerClassName)}>
      {label ? <Text variant="label">{label}</Text> : null}
      <View
        className={cn(
          'min-h-14 flex-row items-center gap-3 rounded-inner border bg-card px-4',
          error ? 'border-danger' : 'border-line',
        )}
      >
        {icon ? <Ionicons color={colors.muted} name={icon} size={20} /> : null}
        <TextInput
          accessibilityLabel={label}
          className={cn('flex-1 py-3 font-sans-medium text-base text-ink', className)}
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
