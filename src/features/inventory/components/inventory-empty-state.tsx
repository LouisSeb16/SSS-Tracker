import { EmptyState } from '@/shared/components/ui/empty-state';

type Props = {
  onAddItem: () => void;
};

export function InventoryEmptyState({ onAddItem }: Props) {
  return (
    <EmptyState
      actionLabel="Add your first item"
      description="Add your first item to start tracking stock and sales."
      icon="cube"
      onAction={onAddItem}
      title="Your stockroom is empty"
    />
  );
}
