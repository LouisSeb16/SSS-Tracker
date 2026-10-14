import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, type PressableProps } from 'react-native';

import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/lib/cn';
import { colors } from '@/shared/theme/colors';

const containers = {
  primary: 'bg-primary active:opacity-80',
  secondary: 'bg-surface active:bg-surface-pressed',
  danger: 'bg-danger active:opacity-80',
} as const;

const labels = {
  primary: 'text-primary-foreground',
  secondary: 'text-foreground',
  danger: 'text-primary-foreground',
} as const;

const iconColors = {
  primary: colors['primary-foreground'],
  secondary: colors.foreground,
  danger: colors['primary-foreground'],
} as const;

type Props = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: keyof typeof containers;
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
};

export function Button({ title, variant = 'primary', icon, disabled, className, ...rest }: Props) {
  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      className={cn(
        'min-h-12 flex-row items-center justify-center gap-2 rounded-control px-6',
        containers[variant],
        disabled && 'opacity-50',
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {icon ? <MaterialCommunityIcons color={iconColors[variant]} name={icon} size={20} /> : null}
      <Text className={cn('font-inter-semibold', labels[variant])}>{title}</Text>
    </Pressable>
  );
}
