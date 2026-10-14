import { render, screen, userEvent } from '@testing-library/react-native';

import { Button } from '@/shared/components/ui/button';
import { Chip } from '@/shared/components/ui/chip';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Input } from '@/shared/components/ui/input';
import { Screen } from '@/shared/components/ui/screen';

describe('Button', () => {
  it('is announced as a button and calls onPress', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(<Button onPress={onPress} title="Save" />);

    await user.press(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire when disabled', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(<Button disabled onPress={onPress} title="Save" />);

    await user.press(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('Chip', () => {
  it('exposes its selected state', async () => {
    await render(<Chip label="Low stock" selected />);
    expect(screen.getByRole('button', { name: 'Low stock' })).toBeSelected();
  });
});

describe('Input', () => {
  it('shows the label and the inline error', async () => {
    await render(<Input error="Name is required" label="Name" />);
    expect(screen.getByText('Name')).toBeOnTheScreen();
    expect(screen.getByText('Name is required')).toBeOnTheScreen();
  });

  it('shows no error text when valid', async () => {
    await render(<Input label="Name" />);
    expect(screen.queryByText('Name is required')).not.toBeOnTheScreen();
  });
});

describe('EmptyState', () => {
  it('renders the action only when one is provided', async () => {
    const onAction = jest.fn();
    const user = userEvent.setup();
    await render(
      <EmptyState
        actionLabel="Add your first item"
        description="Nothing here yet"
        icon="package-variant-closed"
        onAction={onAction}
        title="Empty"
      />,
    );

    await user.press(screen.getByRole('button', { name: 'Add your first item' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('has no button without an action', async () => {
    await render(<EmptyState description="d" icon="package-variant-closed" title="Empty" />);
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });
});

describe('Screen', () => {
  it('renders a header and its children', async () => {
    await render(
      <Screen subtitle="Sub" title="Inventory">
        <Button title="Child" />
      </Screen>,
    );
    expect(screen.getByRole('header')).toHaveTextContent('Inventory');
    expect(screen.getByText('Sub')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Child' })).toBeOnTheScreen();
  });
});
