import { useState } from 'react';

import { InventoryEmptyState } from '@/features/inventory/components/inventory-empty-state';
import { Button } from '@/shared/components/ui/button';
import { Chip } from '@/shared/components/ui/chip';
import { Input } from '@/shared/components/ui/input';
import { Screen } from '@/shared/components/ui/screen';

export function InventoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Placeholder until the item form exists (Phase 3).
  const addItem = () => undefined;

  return (
    <Screen accent="Stockroom" subtitle="Track what your shop has on hand." title="Inventory">
      <Input
        accessibilityLabel="Search inventory"
        autoCapitalize="none"
        autoCorrect={false}
        containerClassName="mt-6"
        icon="search"
        onChangeText={setSearchQuery}
        placeholder="Search items"
        value={searchQuery}
      />

      <Chip
        className="mt-3"
        label="Low stock"
        onPress={() => setShowLowStockOnly((current) => !current)}
        selected={showLowStockOnly}
      />

      <InventoryEmptyState onAddItem={addItem} />

      <Button className="mb-4" icon="add" onPress={addItem} title="Add item" variant="dark" />
    </Screen>
  );
}
