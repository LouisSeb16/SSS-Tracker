# Stockroom: Product and Technical Spec

_Working title. Version 1 draft. App 1 of 3 in the React Native practice series._

## 1. Overview

**What it is.** An offline-first mobile app for small shop owners to track stock, record sales, and see how the day went. Everything lives on the phone: no accounts, no server, no network needed.

**Who it is for.** An owner or attendant of a small store (kiosk, provisions shop, boutique, pharmacy counter) who works on a patchy connection, uses one phone, and currently tracks stock in a notebook.

**Why this app.** It is small enough to finish in three weeks, yet it forces real mobile engineering decisions: a local database with migrations, transactions, searchable lists, validated forms, navigation, safe areas and keyboards, and shipping a real build to a physical device.

**Goals**

- Ship a working app installed on a physical phone through EAS Build.
- Practise standard mobile architecture and conventions, not just make it work.
- Understand every layer well enough to explain it in an interview.

**Non-goals for v1:** accounts or login, cloud sync, multi-device or multi-user, barcode scanning, receipt printing, tablet layouts, translations.

**Learning checklist:** Expo Router, SQLite and migrations, database transactions, TanStack Query over local data, Zustand for UI state, Zod with React Hook Form, NativeWind, Jest with React Native Testing Library, EAS Build.

## 2. Features and user stories

Priority: **M** = must have in v1, **S** = should have, **C** = could have (stretch).

| ID  | Pri | Story                                                 | Acceptance criteria                                                                                                                                                                                                |
| --- | --- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| F1  | M   | Inventory list: see all items with quantity and price | Sorted by name. Instant search by name. Empty state with an 'Add your first item' action. Archived items hidden.                                                                                                   |
| F2  | M   | Add and edit an item                                  | Name required (1 to 80 chars). Selling price greater than 0. Cost price 0 or more. Quantity and low-stock threshold are whole numbers 0 or more. Inline field errors. Duplicate name shows a warning, not a block. |
| F3  | M   | Archive an item                                       | Confirmation dialog. Disappears from lists. Past sales still show its name.                                                                                                                                        |
| F4  | M   | Adjust stock (restock, correction, damaged)           | Quantity and optional reason. Creates a stock movement. Result can never go below 0.                                                                                                                               |
| F5  | M   | Record a sale                                         | Pick items, set quantities, see running total. Cannot exceed stock on hand. Saves all-or-nothing, decrements stock, clears the cart, shows clear success feedback.                                                 |
| F6  | M   | Daily summary                                         | Revenue, number of sales, units sold, estimated profit, top 5 items, date selector. Numbers match the sales list. An empty day shows zeros.                                                                        |
| F7  | S   | Low-stock flags                                       | Items at or below threshold are marked. 'Low stock' filter chip. Count badge on the Inventory tab.                                                                                                                 |
| F8  | S   | Sale history                                          | List of a day's sales, tap for line-item detail.                                                                                                                                                                   |
| F9  | S   | Settings                                              | Currency code and default low-stock threshold, persisted.                                                                                                                                                          |
| F10 | C   | Daily local reminder when items are low               | expo-notifications scheduled locally.                                                                                                                                                                              |
| F11 | C   | CSV export                                            | Inventory and sales through the share sheet.                                                                                                                                                                       |
| F12 | C   | Barcode scan to find or add an item                   | expo-camera.                                                                                                                                                                                                       |
| F13 | C   | Void a sale                                           | Restores stock with reversing movements. Original sale kept, marked voided.                                                                                                                                        |

### Decisions already made (change them if you disagree)

- Overselling is **blocked**, not allowed to go negative.
- Payment method is **not** tracked in v1.
- Currency is configurable, default NGN. Prices are stored in minor units.
- One shop, one device, one user.

## 3. Screens and navigation

Expo Router, file-based. Four tabs: Inventory, Sell, Summary, Settings.

```
src/app/
  _layout.tsx            root: providers, error boundary
  (tabs)/
    _layout.tsx          tab bar
    index.tsx            Inventory list
    sell.tsx             Record sale
    summary.tsx          Daily summary
    settings.tsx         Settings
  item/
    new.tsx              Add item
    [id].tsx             Item detail and edit
    [id]/adjust.tsx      Adjust stock (modal)
  sale/[id].tsx          Sale detail
```

**Screen notes**

- **Inventory:** search bar, 'Low stock' chip, virtualized list of item rows, floating 'Add' button.
- **Item form:** fields from F2, Save button, Archive action on edit.
- **Adjust stock:** type selector, quantity, reason, preview of the new quantity.
- **Sell:** searchable item picker, cart with quantity steppers, sticky footer with total and 'Complete sale'.
- **Summary:** date selector, stat cards, top sellers, link to that day's sales.

**UX rules for every screen:** loading state, empty state, error state. Keyboard never covers an input. Touch targets at least 44pt. Destructive actions confirm. Respect safe areas.

## 4. Data model

Storage is SQLite through `expo-sqlite`, accessed with Drizzle ORM. Migrations are generated by `drizzle-kit` and applied on app start.

**Conventions (learn the reasons, not just the rules)**

- **IDs:** client-generated UUID strings. Lets sync be added later without ID collisions.
- **Money:** integers in minor units (kobo or cents). Never floats, because 0.1 + 0.2 is not 0.3. Format only for display.
- **Time:** integer epoch milliseconds in UTC. Convert to local time only for display and for day boundaries.
- **Soft delete:** `archivedAt` instead of deleting rows, so history stays intact.
- **Snapshots:** sale lines copy the item name, price and cost at the moment of sale, so later price edits never rewrite history.

**items** `id`, `name`, `sku` (nullable), `category` (nullable), `costPrice`, `sellingPrice`, `quantityOnHand`, `lowStockThreshold`, `createdAt`, `updatedAt`, `archivedAt` (nullable)

**stock\_movements** `id`, `itemId` (FK), `type` (initial, restock, sale, correction, damage, void), `quantityChange` (signed integer), `reason` (nullable), `saleId` (nullable FK), `createdAt`

**sales** `id`, `totalAmount`, `totalCost`, `note` (nullable), `createdAt`, `voidedAt` (nullable)

**sale\_items** `id`, `saleId` (FK), `itemId` (FK), `itemName`, `unitPrice`, `unitCost`, `quantity`

**Indexes:** `items(name)`, `items(archivedAt)`, `sales(createdAt)`, `stock_movements(itemId, createdAt)`, `sale_items(saleId)`.

**Invariants (each must have a test)**

1. `quantityOnHand` is never below 0.
2. `quantityOnHand` equals the sum of that item's `quantityChange` values. The movement ledger is the source of truth, and the column is a cached total updated in the same transaction as the movement.
3. `sales.totalAmount` equals the sum of `unitPrice * quantity` across its `sale_items`.

**The key transaction, `recordSale`:** inside one database transaction, check stock for every line, insert the sale and its lines, insert negative movements, and update item quantities. If anything fails, everything rolls back.

## 5. Architecture

### 5.1 Does the web architecture carry over?

**Yes, about 80%.** The five-layer SDK pattern (config, services, validation, queries, container hooks, with purely presentational components) suits React Native well, because React, TypeScript, Zod, TanStack Query and Zustand all work unchanged. The differences:

| Concern                | Web (Next.js)                    | React Native                                                  | What changes                                                                        |
| ---------------------- | -------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Routing                | App Router                       | Expo Router (also file-based)                                 | Route files stay thin                                                               |
| Data source            | HTTP APIs and CMS                | Local SQLite                                                  | `services` splits into `repositories` (data access) and `services` (business rules) |
| Auth tokens            | Cookies                          | No cookies; `expo-secure-store`                               | Not needed in App 1, used in App 2                                                  |
| Persisted client state | Avoid localStorage for big state | SQLite for domain data, small key-value store for preferences | Settings only                                                                       |
| Styling                | Tailwind CSS                     | NativeWind                                                    | No cascade, no CSS selectors                                                        |
| Elements               | div, span, button                | View, Text, Pressable                                         | Text must live inside Text                                                          |
| Long lists             | `map()` into the DOM             | Virtualized FlashList or FlatList                             | Never map large arrays inside a ScrollView                                          |
| Testing                | Jest, RTL, Playwright            | Jest (jest-expo), RNTL, Maestro                               | Native modules need mocks                                                           |
| Deploy                 | Vercel                           | EAS Build, Submit, Update                                     | Builds go through app stores                                                        |

**Three deliberate changes from the web version**

1. **Feature-first folders.** With four domains (inventory, sales, summary, settings), each feature owns its own layers rather than one flat set of layers for the whole app.
2. **A repository layer.** Only repositories touch the database. In App 2 they get swapped for API clients while everything above them stays untouched. That swap is the payoff of the design.
3. **`services` now means business rules** (record a sale, adjust stock, compute a summary), not network calls.

The one rule carried over unchanged: **components are presentational. All logic lives below them.**

### 5.2 Layers and import rules

| Layer          | Responsibility                                                                                | May import                                         | Must not                              |
| -------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------- |
| `app/` routes  | Render a screen, read route params                                                            | screens                                            | contain logic                         |
| `screens`      | Compose a page: call container hooks, pass props down                                         | hooks, components, shared UI                       | call services or db                   |
| `components`   | Props in, JSX out                                                                             | shared UI                                          | fetch, mutate or import hooks that do |
| `hooks`        | Container hooks: combine queries, mutations, Zustand stores and form wiring into a view-model | queries, stores, validation                        | touch repositories or db              |
| `queries`      | TanStack Query keys, `useQuery` and `useMutation` wrappers, invalidation                      | services                                           | import repositories                   |
| `services`     | Business rules, transactions, calculations. Plain TypeScript, no React                        | repositories, validation, other features' services | import React                          |
| `repositories` | The only place Drizzle and SQL appear                                                         | db                                                 | hold business rules                   |
| `validation`   | Zod schemas, types inferred with `z.infer`                                                    | nothing                                            |                                       |
| `config`       | Constants                                                                                     | nothing                                            |                                       |

```
routes -> screens -> hooks -> queries -> services -> repositories -> db
             |                    ^           ^
         components          validation   validation
```

**Rules**

1. Imports flow downward only.
2. Only repositories import Drizzle.
3. Components never import queries, services or db.
4. Validate at the boundaries: in forms, and again at service entry. Never trust callers.
5. Services are React-free, so they are easy to unit test.
6. A feature may call another feature's **service**, never its repository or internals. `sales` calls `inventory` through its service.
7. Services and repository functions accept an optional `tx` (transaction) argument so several writes can share one transaction.
8. Money and dates go through `shared/lib` helpers only.

### 5.3 Folder structure

```
stockroom/
  CLAUDE.md
  docs/SPEC.md
  drizzle/                      generated migrations
  src/
    app/                        Expo Router routes (thin)
    core/
      config/                   constants
      db/                       client, schema, migration runner
      query/                    QueryClient and provider
      providers/                root providers
    features/
      inventory/
        components/  screens/  hooks/  queries/
        services/    repositories/  validation/
      sales/                    same shape
      summary/                  same shape
      settings/                 same shape
    shared/
      components/ui/            Button, Text, Input, Card, Screen, Chip, Stepper, EmptyState
      hooks/
      lib/                      money, dates, id, cn
      theme/
```

If the default template put `app/` at the project root, move it to `src/app` and update the `@/` path alias in `tsconfig.json`. Run the template's `reset-project` script first to clear the demo screens.

### 5.4 State management

- **Domain data:** lives in SQLite, read through TanStack Query. One query key family per feature, invalidated after mutations.
- **Ephemeral UI state:** Zustand (sale cart draft, inventory filters). Not persisted.
- **Preferences:** Zustand with `persist`, stored with the key-value store from `expo-sqlite`, which works in Expo Go and needs no extra native module. Verify against current Expo docs.
- **Form state:** React Hook Form with the Zod resolver.
- **Never copy query data into Zustand.** Two sources of truth drift apart.

### 5.5 Data flow: completing a sale

1. The Sell screen renders from `useSellScreen()`, a container hook.
2. The hook reads the cart from the Zustand store and exposes `completeSale()`.
3. `completeSale()` calls the mutation in `sales/queries`.
4. The mutation calls `salesService.recordSale(cart)`.
5. The service validates input with Zod, opens a transaction, calls `inventoryService.applyMovements(tx, ...)` and the sales repository.
6. On success, the mutation invalidates the inventory, summary and sales query keys, and the cart is cleared.
7. On failure, the transaction rolls back, a typed error is thrown, and the UI maps its code to a message.

## 6. Tech stack

Always install native or Expo-related packages with `npx expo install` so versions match your SDK.

| Area                 | Choice                                                           | Why                                            |
| -------------------- | ---------------------------------------------------------------- | ---------------------------------------------- |
| Platform             | Expo (SDK from your template), TypeScript strict                 | Standard way to build React Native             |
| Navigation           | Expo Router                                                      | File-based, same mental model as Next.js       |
| Database             | `expo-sqlite` and Drizzle ORM, `drizzle-kit`                     | Typed schema and migrations on a real database |
| Server-state cache   | TanStack Query v5                                                | Same as web, handles caching and invalidation  |
| UI state             | Zustand                                                          | Same as web                                    |
| Validation and forms | Zod, React Hook Form, `@hookform/resolvers`                      | One schema for form and service                |
| Styling              | NativeWind (see 6.1)                                             | Tailwind workflow                              |
| Lists                | `@shopify/flash-list`                                            | Standard for performant lists                  |
| Utilities            | `date-fns`, `expo-crypto` (randomUUID), `clsx`, `tailwind-merge` | Small and standard                             |
| Icons                | `@expo/vector-icons`                                             | Ships with Expo, zero setup                    |
| Testing              | Jest with `jest-expo`, React Native Testing Library              | Standard                                       |
| Quality              | ESLint with `eslint-config-expo`, Prettier                       | Standard                                       |
| Builds               | EAS Build                                                        | Real device builds                             |

### 6.1 Styling: is there a Tailwind for mobile?

**Yes. NativeWind is the closest and most widely used.** You write `className='flex-1 bg-white p-4'` and it compiles Tailwind classes into React Native styles at build time.

| Option         | What it is                       | Notes                                                                                                            |
| -------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **NativeWind** | Tailwind classes via `className` | v4 is the long-stable line, built on Tailwind v3. v5 is built on Tailwind v4.1+ and needs a recent React Native. |
| Uniwind        | Tailwind v4 for React Native     | Newer, live theme switching                                                                                      |
| Unistyles 3    | StyleSheet-style API with themes | Fast, not Tailwind                                                                                               |
| Tamagui        | Full design system with compiler | Powerful, heavier to learn                                                                                       |
| StyleSheet     | Built in                         | The baseline everything else compiles to                                                                         |

**Recommendation:** NativeWind. Check which version fits the Expo SDK in your template, then follow **that version's** official Expo setup guide exactly and do not mix v4 and v5 instructions. Setup touches `tailwind.config.js`, `global.css`, `babel.config.js`, `metro.config.js` and a type declaration file.

**Gotchas**

- React Native has no CSS cascade. Text styles do not inherit from a parent View.
- After any config change, restart with `npx expo start -c` to clear the Metro cache.
- Passing `className` through your own components requires the component to accept and forward it.
- Spend an hour on plain `StyleSheet` and Flexbox first. React Native defaults to `flexDirection: 'column'`, and NativeWind will make more sense afterwards.

**Design tokens:** define semantic colors in the Tailwind config (`background`, `foreground`, `primary`, `muted`, `border`, `danger`) so screens never hard-code hex values.

**UI primitives:** build your own in `shared/components/ui` with a small `cn()` helper (`clsx` plus `tailwind-merge`). A shadcn-style library for React Native exists (react-native-reusables); study it after v1 rather than starting with it.

## 7. Quality standards

- **TypeScript:** strict mode, no `any`, types kept simple and close to where they are used, inferred from Zod where possible.
- **Scripts:** `typecheck`, `lint`, `test`. All three pass before every commit.
- **Tests:** unit tests for money and date helpers, Zod schemas, and every service rule including the three invariants. RNTL tests for the item form and the cart. A manual device checklist. Maestro end-to-end is a stretch goal. Aim for the business rules to be covered, not for a percentage.
- **Performance:** virtualized lists with stable keys and memoized rows. No queries inside render. Indexes on queried columns.
- **Accessibility:** labels and roles on pressables, 44pt targets, sufficient contrast, layouts that survive larger system fonts.
- **Errors:** services throw typed errors with a code. The UI maps codes to messages. A root error boundary catches the rest. Never swallow an error silently.
- **Privacy:** data stays on the device. No analytics in v1. The SQLite file is not encrypted, which is acceptable for this scope but worth knowing.
- **Git:** small commits with clear messages, one branch per phase, review your own diff before merging.

## 8. Build plan (three weeks)

### Week 1: Foundation and inventory

1. Clear the template demo, create the `src/` structure, set the `@/` alias, strict TypeScript, ESLint, Prettier, scripts.
2. Set up NativeWind, theme tokens, `cn()`, and the first UI primitives.
3. Providers: QueryClient, database init, run migrations on startup, error boundary.
4. Drizzle schema and first migration for `items` and `stock_movements`.
5. Inventory feature end to end: repository, service, queries, hooks, list screen with search, item form with Zod and React Hook Form, archive.

**Exit:** add, edit, search and archive items; data survives an app restart; typecheck and lint are clean; tests exist for validation and money helpers.

### Week 2: Stock and sales

6. Migration for `sales` and `sale_items`.
7. Adjust-stock flow, movement ledger, invariant tests.
8. Sell screen: Zustand cart, item picker, steppers, totals, stock validation.
9. `recordSale` service in a transaction, including a test that proves rollback.
10. Sale history list and detail (F8).

**Exit:** selling decrements stock correctly; a failed sale leaves no partial data; all three invariants are tested.

### Week 3: Summary, polish and ship

11. `getDailySummary` service using local-day boundaries, and the Summary screen.
12. Low-stock flags, filter and tab badge, then Settings.
13. Polish: empty, loading and error states, keyboard handling, safe areas, app icon and splash screen.
14. Test pass: unit and RNTL tests, then the manual checklist in airplane mode.
15. EAS: configure `eas.json`, make a development build, then a preview build installed on your phone. Record a 60-second demo. Write the README with an architecture diagram and a short write-up of one thing that broke.

## 9. Working with Claude Code

**How to use it so you learn, not just receive code**

- One task from section 8 per session. Small diffs.
- Ask for the approach and the reasons **before** any code.
- After each task: run the app, run the tests, then ask to be quizzed on three things that were built.
- When something breaks, ask for the diagnosis first and the fix second.

**Prompt patterns**

- 'Explain how you would build task 5 in this architecture, step by step, with the trade-offs. Do not write code yet.'
- 'Implement it. Then list the files changed, how I verify it manually, and what could go wrong.'
- 'Quiz me with three questions on what we just built, then check my answers.'
- 'This error appeared: (paste). Explain the cause in plain language before proposing a fix.'

**Paste into `CLAUDE.md` at the project root**

```
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

## Workflow
- Before coding a task: explain the approach and the why, name trade-offs.
- After coding: list changed files, manual test steps, and 3 questions to check my understanding.
- Run `npm run typecheck && npm run lint && npm test` before saying a task is done.
```

## 10. Definition of done

- [ ] Installed on a physical phone from an EAS build
- [ ] Every Must feature works fully in airplane mode
- [ ] Data survives force-quitting and reopening the app
- [ ] A failed sale leaves the database unchanged (tested)
- [ ] The three invariants have passing tests
- [ ] Typecheck, lint and tests are clean
- [ ] Empty, loading and error states exist on every screen
- [ ] README with architecture diagram, 60-second demo video, and a write-up of one thing that broke

## 11. Looking ahead to App 2

Because IDs are client-generated, rows carry `updatedAt`, and repositories sit behind services, App 2 can replace the repository layer with API clients and leave the layers above it nearly unchanged. That is the point of this architecture.

## Appendix: web to React Native cheat sheet

| Web                         | React Native                               |
| --------------------------- | ------------------------------------------ |
| `div`                       | `View`                                     |
| `span`, `p`, headings       | `Text` (all text must be inside it)        |
| `button`                    | `Pressable`                                |
| `input`                     | `TextInput`                                |
| `img`                       | `Image` from `expo-image`                  |
| `ul` and `map()`            | `FlashList` or `FlatList`                  |
| scrolling container         | `ScrollView`                               |
| CSS cascade and inheritance | none, except Text inside Text              |
| `px`                        | density-independent points                 |
| `:hover`                    | pressed state on `Pressable`               |
| `position: fixed`           | absolute positioning plus safe-area insets |
| `localStorage`              | key-value store or SQLite                  |
| `window.alert`              | `Alert.alert`                              |
| media queries               | `useWindowDimensions`                      |
