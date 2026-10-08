import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function InventoryEmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-8 pb-16">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-surface">
        <MaterialCommunityIcons color="#1D9BF0" name="package-variant-closed" size={28} />
      </View>
      <Text className="mt-5 text-center text-xl font-bold text-foreground">
        Your stockroom is empty
      </Text>
      <Text className="mt-2 text-center text-base leading-6 text-muted">
        Add your first item to start tracking stock and sales.
      </Text>
    </View>
  );
}
