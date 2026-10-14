import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

// React Native text does not inherit styles from a parent View, so every Text needs
// its own font and color. This component is the one place that decides them.
// Heavy, tightly spaced headlines and numerals; light, quiet captions.
const variants = {
  display: 'font-sans-extrabold text-5xl tracking-tighter text-ink',
  title: 'font-sans-extrabold text-4xl tracking-tighter text-ink',
  heading: 'font-sans-bold text-xl tracking-tight text-ink',
  body: 'font-sans-medium text-base text-ink',
  label: 'font-sans-semibold text-sm text-ink',
  caption: 'font-sans text-sm text-muted',
} as const;

export type TextVariant = keyof typeof variants;

type Props = RNTextProps & {
  variant?: TextVariant;
  /** Equal-width digits so prices and quantities line up in columns. */
  numeric?: boolean;
};

export function Text({ variant = 'body', numeric = false, className, ...rest }: Props) {
  return (
    <RNText className={cn(variants[variant], numeric && 'tabular-nums', className)} {...rest} />
  );
}
