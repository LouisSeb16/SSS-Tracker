# Stockroom

Offline-first Expo (React Native, TypeScript) stock and sales tracker.
Source of truth: docs/SPEC.md. Follow its architecture rules (section 5).

## Rules

- Imports flow downward only: routes > screens > hooks > queries > services > repositories > db.
- Only repositories import Drizzle. Components hold no business logic.
- Validate with Zod at boundaries (forms and service entry).
- Money = integer minor units. Time = epoch ms UTC. IDs = UUID strings.
- Install native deps with `npx expo install`.
- Keep types simple. No unnecessary abstraction.
- When showing code in chat, show complete files, not fragments.
- Layer rules are enforced by ESLint (`no-restricted-imports` in eslint.config.js).

## Workflow

- Before coding a task: explain the approach and the why, name trade-offs.
- After coding: list changed files, manual test steps, and 3 questions to check my understanding.
- Run `npm run typecheck && npm run lint && npm test` before saying a task is done.
