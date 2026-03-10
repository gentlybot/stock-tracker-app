# AGENTS.md - Stock Tracker App

## Project Overview

Stock Tracker App is a demo/example Ionic React frontend for a stock tracking application. Users can log in, view a portfolio dashboard, search and add stocks, and view stock details with price charts. Targets web only (no native builds).

## Tech Stack

- **Framework:** Ionic React 7 with TypeScript
- **Bundler:** Vite
- **Routing:** `@ionic/react-router` + `react-router-dom` v5
- **Data fetching:** `@tanstack/react-query`
- **Styling:** `@emotion/react` + `@emotion/styled` (CSS-in-JS), plus Ionic built-in CSS
- **Validation:** Zod (validates API response shapes)
- **Platform:** Capacitor 5 + Cordova 12 (web-only, initialized but no native builds)
- **Integrations:** Awesome Cordova Plugins, Capawesome, Ionic Native

## Project Structure

```
stock-tracker-app/
  capacitor.config.ts          # Capacitor config (webDir: dist)
  vite.config.ts               # Vite config with @emotion jsx pragma
  index.html                   # HTML entry point
  src/
    main.tsx                   # Entry: inits Capacitor, Cordova, renders App
    App.tsx                    # IonApp + IonReactRouter with route definitions
    vite-env.d.ts              # Vite env type declarations
    pages/
      Login.tsx                # Email/password form, calls POST /api/auth/login
      Dashboard.tsx            # Portfolio summary + stock list, pull-to-refresh
      AddStock.tsx             # Searchbar + results, tap to add stock
      StockDetail.tsx          # Price chart, stats grid, remove from portfolio
    components/
      StockCard.tsx            # Card displaying stock symbol, name, price, daily change
      PriceChart.tsx           # SVG line chart from price history data
      PortfolioSummary.tsx     # Summary card (total value, daily change, stock count)
    hooks/
      useAuth.ts               # Login mutation, stores JWT in localStorage
      usePortfolio.ts          # Portfolio query + add/remove mutations
      useStocks.ts             # Stock search query + stock detail query
    services/
      api.ts                   # Fetch wrapper with JWT auth header, base URL from env
      auth.ts                  # Token get/set/clear in localStorage, login API call
    providers/
      AppProviders.tsx         # Wraps app in QueryClientProvider + KnockProvider
    types/
      stock.ts                 # Zod schemas + TypeScript types for Stock, StockDetail, PriceHistory
      user.ts                  # Zod schemas + TypeScript types for User, LoginResponse
    config/
      capacitor.ts             # Capacitor.isNativePlatform() check
      cordova.ts               # Awesome Cordova Plugins + Ionic Native status bar init
```

## Key Patterns

- **Data fetching:** All API calls go through hooks in `src/hooks/` which use `@tanstack/react-query`. Queries use `useQuery`, mutations use `useMutation` with `queryClient.invalidateQueries()` for cache updates.
- **API layer:** `src/services/api.ts` exports a `fetchApi()` helper that prepends `VITE_API_URL`, attaches the JWT `Authorization` header, and parses JSON. All hooks use this.
- **Auth flow:** Login stores JWT + user in localStorage. The `getToken()` function from `src/services/auth.ts` is used by the API layer. No protected route wrapper -- the backend rejects unauthorized requests.
- **Styling:** Components use `@emotion/react`'s `css` prop for custom styles alongside Ionic's built-in component styling.
- **Validation:** API response shapes are validated with Zod schemas in `src/types/`. This catches backend contract mismatches at runtime.
- **Navigation:** `react-router-dom` v5 via `@ionic/react-router`. Routes defined in `App.tsx` with `IonRouterOutlet`. Use `useHistory()` for programmatic navigation.
- **Platform plugins:** Capacitor and Cordova plugins are initialized in `src/main.tsx` before the React render.

## Setup & Running

```bash
npm install
cp .env.example .env           # Edit VITE_API_URL if backend is not on localhost:3001
npm run dev                    # Vite dev server at http://localhost:5173
```

Requires the stock-tracker-api backend to be running.

## Critical: Ionic Stencil Hydration Bug

**NEVER use `IonInput` or `IonTextarea` as controlled components with React state for the `value` prop.** Setting `value` via React state triggers Stencil's `attributeChangedCallback` before the web component's watchers are initialized, causing:

```
TypeError: instance[watchMethodName] is not a function
```

This silently breaks the component — clicks, form submits, and state updates stop working.

### Rules:
1. **Use plain HTML `<input>` / `<textarea>` elements** for forms where you need to programmatically set values (e.g., prefill buttons, reset forms).
2. If you must use `IonInput`, use it **uncontrolled** — do NOT pass a `value` prop bound to React state. Use `ref` to read values on submit.
3. **Never use `IonButton` with `type="submit"` inside a `<form>`** — Ionic buttons don't reliably trigger native form submission. Use `onClick` handlers instead.
4. For prefill/autofill features, set values via DOM refs (`inputRef.current.value = '...'`), not via React state that flows into Ionic component props.

### What breaks:
- `<IonInput value={stateVar} />` + `setState(newVal)` → Stencil crash
- `<IonButton type="submit">` inside `<form onSubmit={...}>` → submit may not fire
- Any programmatic value change on IonInput (refs, imperative API) can trigger the same watcher error

### Affected components (not just IonInput):
The bug affects **any Ionic component with dynamic React-controlled props**:
- `IonSearchbar value={state}` — use plain `<input>` with manual debounce instead
- `IonToast isOpen={state}` — use a CSS-animated div toast instead
- `IonAlert isOpen={state}` / `buttons={[...]}` — use a custom confirm overlay div instead
- `IonButton disabled={state}` / `IonItem disabled={state}` — use `style={{ opacity: 0.5, pointerEvents: 'none' }}` instead of the `disabled` prop
- `IonInput value={state}` — use plain `<input>` elements

### Safe pattern:
```tsx
const emailRef = useRef<HTMLInputElement>(null);
// Use plain <input ref={emailRef} />
// Read with emailRef.current?.value on submit
```

### Toast replacement pattern:
```tsx
const [toast, setToast] = useState<{ message: string; key: number } | null>(null);
const showToast = (msg: string) => {
  setToast({ message: msg, key: Date.now() });
  setTimeout(() => setToast(null), 2600);
};
// Render: {toast && <div key={toast.key} className="toast">{toast.message}</div>}
```

## Common Tasks

- **Add a new page:** Create a component in `src/pages/`, add a `<Route>` in `App.tsx`.
- **Add a new API call:** Add a function in `src/services/`, create a hook in `src/hooks/` using `useQuery` or `useMutation`.
- **Add a new Zod schema:** Define in `src/types/`, import in the relevant hook to validate the response.
- **Change API base URL:** Set `VITE_API_URL` in `.env`.
- **Build for production:** `npm run build` outputs to `dist/`.
