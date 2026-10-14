import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

// React Native text does not inherit styles from a parent View, so every Text needs
// its own font and color. This component is the one place that decides them.
const variants = {
  title: 'font-inter-bold text-3xl tracking-tight text-foreground',
  heading: 'font-inter-semibold text-xl text-foreground',
  body: 'font-inter text-base text-foreground',
  label: 'font-inter-semibold text-sm text-foreground',
  caption: 'font-inter text-sm text-muted',
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
