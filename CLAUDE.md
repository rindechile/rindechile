# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RindeChile is a Chilean government procurement transparency platform. It visualizes public spending data across 16 regions and 430+ municipalities using interactive D3 maps and treemap visualizations. Built with Next.js 16, Cloudflare D1 (via OpenNext), and Drizzle ORM.

The platform is developed mobile-first and accessible-first. All UI text is in Spanish (`lang="es"`).

## Development Commands

```bash
pnpm dev                    # Start dev server (localhost:3000)
pnpm build                  # Build for production
pnpm lint                   # Run ESLint (flat config, v9)
pnpm preview                # Build + preview via OpenNext/Cloudflare
pnpm deploy                 # Build + deploy to Cloudflare Pages
```

## Database Commands

```bash
# Drizzle ORM
pnpm drizzle:generate       # Generate migrations from schema
pnpm drizzle:migrate        # Apply migrations
pnpm drizzle:dev            # Open Drizzle Studio GUI

# Seeding (order matters - FK constraints)
pnpm db:seed:unspsc         # 1. UNSPSC taxonomy (categories→segments→families→classes→commodities)
pnpm db:seed:items          # 2. Item classifications
pnpm db:seed:locations      # 3. Regions + municipalities
pnpm db:seed:suppliers      # 4. Suppliers
pnpm db:seed:purchases      # 5. Purchases (620K+ records)
pnpm db:seed:all            # Run all in order

# Remote variants (add :remote suffix)
pnpm db:seed:all:remote     # Seed remote D1 database

# Reset
pnpm db:reset               # Drop all + migrate (local)
pnpm db:reset:remote        # Drop all + migrate (remote)
```

## Code Generation

```bash
pnpm generate:static-data   # Generate static JSON data files (data_regions.json, data_municipalities.json)
pnpm cf-typegen             # Generate CloudflareEnv types from wrangler config
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (React 19, Turbopack) |
| Deployment | `@opennextjs/cloudflare` on Cloudflare Pages/Workers |
| Database | Cloudflare D1 (SQLite), binding `"DB"`, database `"transparenta"` |
| ORM | Drizzle ORM (sqlite dialect, d1-http driver) |
| Styling | Tailwind CSS v4 (PostCSS plugin, `@theme` in CSS — no `tailwind.config.ts`) |
| UI Components | shadcn/ui (new-york style) + Radix UI primitives |
| Maps | D3.js v7 (SVG rendering, geo projections) |
| Charts | Recharts 3 |
| Data Tables | TanStack Table v8 |
| Animations | Framer Motion |
| Search | fuse.js (fuzzy), cmdk (command palette) |
| Icons | Lucide React |
| Font | Manrope (Google Fonts) |
| Package Manager | pnpm (enforced via preinstall) |

## Architecture

### Route Structure

| Route | Description |
|-------|------------|
| `/` | Home page with interactive Chile map (country view) |
| `/[region]` | Region detail page (slug-based, e.g., `/atacama`) |
| `/methodology` | Methodology article page |

### API Routes (Cloudflare D1 queries)

| Endpoint | Purpose |
|----------|---------|
| `/api/treemap` | UNSPSC category treemap aggregation (drill-down: category→segment→family→class) |
| `/api/purchases` | Paginated purchase records with search, filtering, sorting |
| `/api/purchases/filters` | Filter options for purchase table |
| `/api/municipalities` | All municipalities with region names |
| `/api/municipalities/[id]` | Single municipality detail with purchase stats |

### Hybrid Data Strategy

- **Static JSON** (`app/data/`): Pre-computed region/municipality stats for instant map rendering (`data_regions.json`, `data_municipalities.json`, `treemap_country.json`)
- **GeoJSON** (`public/data/`): Chile regions (`chile_regions.json`) and per-region municipality files (`municipalities_by_region/{1-16}.geojson`)
- **Name mapping** (`public/data/municipality_name_mapping.json`): Pre-computed GeoJSON→data key mapping for O(1) lookups
- **API Routes** (`app/api/`): Real-time D1 queries for treemap drill-downs, purchase tables, and filtering

### Data Flow: Map Rendering

1. Load GeoJSON from `public/data/`
2. Enrich with stats from `app/data/` via `data-service.ts`
3. Name normalization handles Chilean accent/character mismatches (`name-normalizer.ts`)
4. Render SVG with D3 geo projections
5. Apply tertile-based color scale (bajo/medio/alto severity tiers)

### Database Schema (12 tables in `schemas/drizzle.ts`)

**UNSPSC Taxonomy** (hierarchical):
- `categories` → `segments` → `families` → `classes` → `commodities`

**Core Data**:
- `regions`: 16 Chilean regions
- `municipalities`: 430+ municipalities (FK to regions, includes budget data)
- `items`: Product classifications (FK to commodities, includes expected price ranges)
- `suppliers`: 30K+ government suppliers (PK: rut)
- `purchases`: 620K+ procurement records (FKs to items, municipalities, suppliers)

**Document Scraping**:
- `document_scrapes`: ChileCompra document scraping status and R2 storage refs
- `attachments`: Individual files from scraped documents (stored in R2)

### Key State Management

- `app/contexts/MapContext.tsx`: Centralized state for map interactions, GeoJSON caching, selection state, detail panel data
- `lib/region-slugs.ts`: Bidirectional mapping between region codes (1-16) and URL slugs

## Project Structure

```
app/
  api/                          # API route handlers (D1 queries)
  components/
    map/                        # Map & treemap components (ChileMap, TreemapChart, etc.)
      hooks/                    # Map-specific hooks
      filters/                  # Map filter components
    navigation/                 # Header, sidebar, footer, breadcrumbs, search
      hooks/                    # Navigation-specific hooks
    purchases/                  # Purchase table, filters, cards, columns
    ui/                         # shadcn/ui components (add via CLI, do NOT manually create)
    ClientPageContent.tsx       # Main page content wrapper
    DetailPanel.tsx             # Region/municipality detail sidebar
  contexts/                     # React contexts (MapContext)
  data/                         # Pre-computed static JSON
  lib/                          # App-level utilities
    hooks/                      # Shared hooks (useAsyncData, useFormatters, useSeverityLevel)
    data-service.ts             # Data fetching, enrichment, caching
    name-normalizer.ts          # Chilean name/accent normalization
  styles/                       # CSS files (globals, variables, base, utilities)
hooks/                          # Root-level hooks (shadcn useIsMobile)
lib/
  region-slugs.ts               # URL slug ↔ region code mapping
  utils.ts                      # cn() utility for Tailwind class merging
types/
  map.ts                        # All map/visualization TypeScript interfaces
schemas/
  drizzle.ts                    # Database schema definition
  data/                         # Seed CSV files
scripts/                        # Seeding and generation scripts
docs/                           # Extended documentation (API, Architecture, Database, Deployment, Setup)
```

### Hooks Reference

| Hook | Location | Purpose |
|------|----------|---------|
| `useAsyncData<T>` | `app/lib/hooks/` | Generic async fetch with cleanup |
| `useFormatters` | `app/lib/hooks/` | i18n number formatting |
| `useSeverityLevel` | `app/lib/hooks/` | Color scale business logic |
| `useMapNavigation` | `app/components/map/hooks/` | Map navigation state |
| `useAriaLive` | `app/components/map/hooks/` | Accessibility live announcements |
| `useColorScale` | `app/components/map/hooks/` | Tertile color breakpoints by view level |
| `useResponsiveDimensions` | `app/components/map/hooks/` | Responsive SVG sizing |
| `useTreemapNavigation` | `app/components/map/hooks/` | Treemap drill-down state |
| `useTreemapRenderer` | `app/components/map/hooks/` | D3 treemap rendering logic |
| `useViewportSize` | `app/components/map/hooks/` | Viewport dimensions |
| `useScrolled` | `app/components/navigation/hooks/` | Scroll position tracking |
| `useIsMobile` | `hooks/` | Mobile breakpoint detection (shadcn) |

## Code Conventions

### Path Aliases

`@/*` maps to project root (configured in `tsconfig.json`). Always use: `import { cn } from '@/lib/utils'`

### shadcn/ui Components

- Style: `new-york`. Components live in `app/components/ui/`
- Add new components via CLI: `npx shadcn@latest add <component>` (do NOT create manually)
- Uses `cn()` from `lib/utils.ts` for Tailwind class merging (`clsx` + `tailwind-merge`)
- Icons from `lucide-react`

### Styling

- Tailwind CSS v4 with PostCSS — theme defined in `app/styles/variables.css` via `@theme` directive
- Dark-only theme (background: oklch black, all colors in oklch color space)
- Custom breakpoints: `tablet: 768px`, `desktop: 1154px` (NOT standard Tailwind sm/md/lg)
- Map color tiers via CSS variables: `--tier-bajo`, `--tier-medio`, `--tier-alto`
- CSS animations respect `prefers-reduced-motion`

### TypeScript

- Strict mode enabled
- All map/visualization types in `types/map.ts`
- Cloudflare env types auto-generated in `cloudflare-env.d.ts`

### Component Patterns

- Use `"use client"` only when necessary (hooks, interactivity)
- Feature components organized by domain: `map/`, `navigation/`, `purchases/`
- Feature-specific hooks co-located with their components
- Shared hooks in `app/lib/hooks/`

### Database Access Pattern

```typescript
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';

const { env } = await getCloudflareContext();
const db = drizzle(env.DB);
```

### Accessibility

- Skip-to-content link (Spanish: "Saltar al contenido principal")
- `aria-live` announcements via `useAriaLive` hook
- `lang="es"` on `<html>`
- WCAG touch targets (44px minimum via `.touch-target` utility)

### Git Conventions

- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `perf:`
- Run `pnpm lint` before committing

## Key Files

| File | Purpose |
|------|---------|
| `schemas/drizzle.ts` | Database schema (12 tables) |
| `app/contexts/MapContext.tsx` | Global map state management |
| `app/lib/data-service.ts` | Data fetching, enrichment, GeoJSON caching |
| `app/lib/name-normalizer.ts` | Chilean name/accent normalization |
| `lib/region-slugs.ts` | URL slug ↔ region code mapping |
| `lib/utils.ts` | `cn()` class merge utility |
| `types/map.ts` | All TypeScript interfaces |
| `components.json` | shadcn/ui configuration |
| `app/styles/variables.css` | Theme colors, breakpoints, CSS variables |
| `wrangler.toml` | Cloudflare D1/Workers config |
| `drizzle.config.ts` | Drizzle Kit config (sqlite/d1-http) |
| `open-next.config.ts` | OpenNext Cloudflare adapter config |
