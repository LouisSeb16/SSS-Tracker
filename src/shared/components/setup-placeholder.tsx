import { Text, View } from 'react-native';

export function SetupPlaceholder({ title }: { title: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-2xl font-semibold text-foreground">{title}</Text>
      <Text className="mt-2 text-center text-base text-muted">
        The app foundation is ready. This feature will be built in a later step.
      </Text>
    </View>
  );
}
