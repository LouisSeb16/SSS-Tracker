import { View, type ViewProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

// Cards nest: put a card with className="rounded-inner p-4" inside a `card` one.
const tones = {
  light: 'rounded-card bg-card p-5',
  accent: 'rounded-card bg-accent p-5',
  panel: 'rounded-card bg-panel p-5',
} as const;

type Props = ViewProps & { tone?: keyof typeof tones };

export function Card({ tone = 'light', className, ...rest }: Props) {
  return <View className={cn(tones[tone], className)} {...rest} />;
}
