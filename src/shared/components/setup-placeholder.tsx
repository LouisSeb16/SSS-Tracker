import { View } from 'react-native';

import { Screen } from '@/shared/components/ui/screen';
import { Text } from '@/shared/components/ui/text';

type Props = { title: string; accent: string };

export function SetupPlaceholder({ title, accent }: Props) {
  return (
    <Screen accent={accent} title={title}>
      <View className="flex-1 items-center justify-center px-6 pb-8">
        <Text className="text-center" variant="caption">
          The app foundation is ready. This feature will be built in a later step.
        </Text>
      </View>
    </Screen>
  );
}
