import { View, type ViewProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

export function Card({ className, ...rest }: ViewProps) {
  return <View className={cn('rounded-card bg-surface p-4', className)} {...rest} />;
}
