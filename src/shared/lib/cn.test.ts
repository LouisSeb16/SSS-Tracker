import { cn } from '@/shared/lib/cn';

describe('cn', () => {
  it('joins truthy values and drops falsy ones', () => {
    expect(cn('p-4', false, undefined, 'mt-2', ['flex-row'])).toBe('p-4 mt-2 flex-row');
  });

  it('lets the last conflicting class win', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('treats text size and text color as different groups', () => {
    expect(cn('text-sm text-muted', 'text-foreground')).toBe('text-sm text-foreground');
  });

  it('resolves conflicts between our custom radius tokens', () => {
    expect(cn('rounded-card', 'rounded-control')).toBe('rounded-control');
    expect(cn('rounded-control', 'rounded-full')).toBe('rounded-full');
  });

  it('resolves conflicts between Inter weights', () => {
    expect(cn('font-inter', 'font-inter-bold')).toBe('font-inter-bold');
  });
});
