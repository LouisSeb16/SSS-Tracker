import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { View } from 'react-native';

import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { colors } from '@/shared/theme/colors';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
  return (
    <View className="flex-1 items-center justify-center gap-2 px-6 pb-8">
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-card bg-panel">
        <Ionicons color={colors.accent} name={icon} size={36} />
      </View>
      <Text className="text-center" variant="heading">
        {title}
      </Text>
      <Text className="text-center leading-5" variant="caption">
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Button className="mt-4 text-white" onPress={onAction} title={actionLabel} />
      ) : null}
    </View>
  );
}
