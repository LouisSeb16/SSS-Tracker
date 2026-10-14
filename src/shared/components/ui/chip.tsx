import { Pressable, type PressableProps } from 'react-native';

import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/lib/cn';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  selected?: boolean;
};

export function Chip({ label, selected = false, className, ...rest }: Props) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={cn(
        'min-h-11 items-center justify-center self-start rounded-full border px-4',
        selected ? 'border-primary bg-primary' : 'border-border bg-background active:bg-surface',
        className,
      )}
      {...rest}
    >
      <Text className={selected ? 'text-primary-foreground' : undefined} variant="label">
        {label}
      </Text>
    </Pressable>
  );
}
