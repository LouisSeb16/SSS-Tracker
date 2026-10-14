import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge only knows Tailwind's built-in scales, so our custom radius and
// font-family tokens are registered here. Otherwise rounded-card and rounded-lg
// would not be seen as conflicting.
const twMerge = extendTailwindMerge({
  extend: {
    theme: { borderRadius: ['inner', 'card'] },
    classGroups: {
      'font-family': [{ font: ['sans-medium', 'sans-semibold', 'sans-bold', 'sans-extrabold'] }],
    },
  },
});

/** Join class names and resolve Tailwind conflicts, the last class wins. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
