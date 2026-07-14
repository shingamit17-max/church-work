@AGENTS.md

# Claude-Specific Instructions for Grace Mentor

## Context Loading Order
1. Read `task.md` — know what's done and what's next
2. Read `AGENTS.md` — project rules and structure
3. Read `grace-mentor-prd.md` — full product requirements (if you need detail on a specific feature)
4. Check `node_modules/next/dist/docs/` — before using any Next.js API (this is v16, not what you remember)

## Code Style & Conventions

### TypeScript
- Strict mode enabled — no `any` types without justification
- Use interfaces for data shapes, enums for fixed sets (user roles, career stages, pain points, etc.)
- All interfaces/enums live in `/types/`
- Prefer `type` for unions and utility types, `interface` for object shapes

### React / Next.js
- Default to **Server Components** — only add `'use client'` when the component genuinely needs browser APIs, hooks, or event handlers
- Use Next.js App Router conventions (not Pages Router)
- Route Handlers go in `app/api/` — use `NextRequest`/`NextResponse`
- Metadata: use the `metadata` export or `generateMetadata()` in `layout.tsx` / `page.tsx`
- Dynamic route params: check Next.js 16 docs for current API (may differ from v14/v15)

### Styling
- Tailwind CSS **v4** — NO `tailwind.config.js`. Use `@theme` directive in `app/globals.css` for design tokens
- Dark-mode first: design for dark backgrounds, ensure light mode also works
- Glassmorphism: `backdrop-blur`, semi-transparent backgrounds, subtle borders
- Animations: use CSS transitions/animations or Tailwind's built-in utilities
- Mobile-first: start with mobile layout, scale up with breakpoints

### API Routes
- Always validate request body (use Zod or manual validation)
- Always check authentication via session
- Return consistent JSON shape: `{ success: boolean, data?: any, error?: string }`
- Use proper HTTP status codes

### Database
- Import `dbConnect` from `@/lib/db` at the top of every API route / server action that touches the DB
- Mongoose models: define schema in `/models/`, export the model with `mongoose.models.X || mongoose.model('X', schema)` pattern to avoid re-compilation in dev

## Error Handling
- API routes: try/catch with 500 fallback, log errors server-side
- Client components: error boundaries where appropriate
- Forms: inline validation errors + toast notifications for server errors

## File Naming
- Components: PascalCase (`EventCard.tsx`, `OnboardingWizard.tsx`)
- Utilities/libs: camelCase (`db.ts`, `matching.ts`, `auth.ts`)
- Types: PascalCase filenames, PascalCase exports (`User.ts` → `interface User {}`)
- API routes: `route.ts` inside the appropriate `app/api/` directory

## What NOT to Do
- Do NOT create a `src/` directory — this project has `app/` at root
- Do NOT use `tailwind.config.js` — Tailwind v4 uses CSS-first config
- Do NOT use Pages Router patterns (`getServerSideProps`, `getStaticProps`, etc.)
- Do NOT hardcode secrets or API keys
- Do NOT skip reading Next.js 16 docs before using framework APIs
- Do NOT put payment logic in early phases — payments are Phase 16 (explicitly last)
- Do NOT make the mentee dashboard public — it contains sensitive data
- Do NOT present AI output as if it came from a real mentor
