import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, type PressableProps } from 'react-native';

import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/lib/cn';
import { colors } from '@/shared/theme/colors';

// Text on the bright accent is always ink: white on it is only 3:1 contrast.
const styles = {
  primary: { container: 'bg-accent active:opacity-80', label: 'text-ink', icon: colors.ink },
  dark: { container: 'bg-ink active:opacity-80', label: 'text-white', icon: '#FFFFFF' },
  secondary: {
    container: 'border border-line bg-card active:bg-canvas',
    label: 'text-ink',
    icon: colors.ink,
  },
  danger: { container: 'bg-danger active:opacity-80', label: 'text-white', icon: '#FFFFFF' },
} as const;

type Props = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: keyof typeof styles;
  icon?: ComponentProps<typeof Ionicons>['name'];
};

export function Button({ title, variant = 'primary', icon, disabled, className, ...rest }: Props) {
  const style = styles[variant];

  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      className={cn(
        'min-h-14 flex-row items-center justify-center gap-2 rounded-full px-6',
        style.container,
        disabled && 'opacity-50',
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {icon ? <Ionicons color={style.icon} name={icon} size={20} /> : null}
      <Text className={cn('font-sans-bold', style.label)}>{title}</Text>
    </Pressable>
  );
}
