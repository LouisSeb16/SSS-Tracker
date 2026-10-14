import { formatMoney, parseMoneyInput } from '@/shared/lib/money';

describe('parseMoneyInput', () => {
  it.each([
    ['12', 1200],
    ['12.5', 1250],
    ['12.50', 1250],
    ['0.05', 5],
    ['1,250.50', 125050],
    ['  7  ', 700],
    ['0', 0],
  ])('parses %s to %i minor units', (input, expected) => {
    expect(parseMoneyInput(input)).toBe(expected);
  });

  it('avoids the float error that parseFloat * 100 has', () => {
    expect(19.99 * 100).not.toBe(1999);
    expect(parseMoneyInput('19.99')).toBe(1999);
  });

  it.each(['', 'abc', '-5', '1.234', '1.', '.5', '1e3', '12 50'])('rejects %j', (input) => {
    expect(parseMoneyInput(input)).toBeNull();
  });

  it('rejects amounts too large to store exactly', () => {
    expect(parseMoneyInput('99999999999999999999')).toBeNull();
  });
});

describe('formatMoney', () => {
  it('formats minor units with the currency symbol and separators', () => {
    expect(formatMoney(125050, 'NGN')).toContain('1,250.50');
    expect(formatMoney(125050, 'NGN')).toContain('₦');
  });

  it('formats zero', () => {
    expect(formatMoney(0, 'USD')).toContain('0.00');
  });

  it('rejects non-integers so floats never reach the screen', () => {
    expect(() => formatMoney(10.5)).toThrow(RangeError);
  });
});
