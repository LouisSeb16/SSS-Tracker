import { cn } from '@/shared/lib/cn';

describe('cn', () => {
  it('joins truthy values and drops falsy ones', () => {
    expect(cn('p-4', false, undefined, 'mt-2', ['flex-row'])).toBe('p-4 mt-2 flex-row');
  });

  it('lets the last conflicting class win', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('treats text size and our text colors as different groups', () => {
    expect(cn('text-sm text-muted', 'text-ink')).toBe('text-sm text-ink');
    expect(cn('text-ink', 'text-panel-muted')).toBe('text-panel-muted');
    expect(cn('text-5xl', 'text-accent-text')).toBe('text-5xl text-accent-text');
  });

  it('resolves conflicts between our custom radius tokens', () => {
    expect(cn('rounded-card', 'rounded-inner')).toBe('rounded-inner');
    expect(cn('rounded-inner', 'rounded-full')).toBe('rounded-full');
  });

  it('resolves conflicts between font weights', () => {
    expect(cn('font-sans', 'font-sans-bold')).toBe('font-sans-bold');
    expect(cn('font-sans-extrabold', 'font-sans-semibold')).toBe('font-sans-semibold');
  });
});
