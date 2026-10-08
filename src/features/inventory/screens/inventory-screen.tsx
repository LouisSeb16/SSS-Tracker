import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InventoryEmptyState } from '@/features/inventory/components/inventory-empty-state';

export function InventoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <View className="flex-1 px-5 pt-4">
        <Text className="text-3xl font-bold tracking-tight text-foreground">Inventory</Text>
        <Text className="mt-1 text-base text-muted">Track what your shop has on hand.</Text>

        <View className="mt-6 h-12 flex-row items-center rounded-full bg-surface px-4">
          <MaterialCommunityIcons color="#536471" name="magnify" size={22} />
          <TextInput
            accessibilityLabel="Search inventory"
            autoCapitalize="none"
            autoCorrect={false}
            className="ml-3 flex-1 text-base text-foreground"
            onChangeText={setSearchQuery}
            placeholder="Search items"
            placeholderTextColor="#536471"
            value={searchQuery}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: showLowStockOnly }}
          className={`mt-3 min-h-11 justify-center self-start rounded-full border px-4 ${
            showLowStockOnly ? 'border-primary bg-primary' : 'border-border bg-background'
          }`}
          onPress={() => setShowLowStockOnly((current) => !current)}
        >
          <Text
            className={`text-sm font-semibold ${showLowStockOnly ? 'text-white' : 'text-foreground'}`}
          >
            Low stock
          </Text>
        </Pressable>

        <InventoryEmptyState />

        <Pressable
          accessibilityLabel="Add item"
          accessibilityRole="button"
          className="mb-4 min-h-12 flex-row items-center justify-center rounded-full bg-primary px-5"
          onPress={() => undefined}
        >
          <MaterialCommunityIcons color="#FFFFFF" name="plus" size={20} />
          <Text className="ml-2 text-base font-bold text-white">Add item</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
