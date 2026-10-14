import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { View } from 'react-native';

import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { colors } from '@/shared/theme/colors';

type Props = {
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
  return (
    <View className="flex-1 items-center justify-center gap-2 px-8 pb-16">
      <View className="mb-3 h-16 w-16 items-center justify-center rounded-card bg-surface">
        <MaterialCommunityIcons color={colors.primary} name={icon} size={32} />
      </View>
      <Text className="text-center" variant="heading">
        {title}
      </Text>
      <Text className="text-center leading-6" variant="caption">
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Button className="mt-4" onPress={onAction} title={actionLabel} />
      ) : null}
    </View>
  );
}
