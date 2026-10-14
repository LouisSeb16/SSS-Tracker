import { randomUUID } from 'expo-crypto';

// Client-generated IDs let rows be created offline, and sync can be added later
// without ID collisions. Wrapped so tests can mock one function.
export function newId(): string {
  return randomUUID();
}
