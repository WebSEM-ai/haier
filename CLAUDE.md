# Haier România — Project Documentation

## Overview

Catalog de produse Haier pentru climatizare rezidențială — site e-commerce cu CMS headless.

**Stack**: pnpm monorepo + Turbo | Payload CMS 3 (Next.js) | Next.js 16 frontend | Neon PostgreSQL | Cloudflare R2 | Tailwind CSS v4

**Repo GitHub**: `WebSEM-ai/haier`

---

## Architecture

```
haier-ro/
├── apps/
│   ├── cms/          → Payload CMS 3 (port 3001) — deployed on Railway
│   └── web/          → Next.js 16 frontend (port 3000) — deployed on Vercel
├── packages/
│   └── payload-types/ → TypeScript types auto-generated from CMS schema
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### Data Flow

```
[Admin panel]  →  Payload CMS  →  Neon PostgreSQL (cloud DB)
                      ↓
              revalidation hook → POST /api/revalidate
                      ↓
              Next.js frontend (ISR) → displays updated data
```

- **Datele** (produse, categorii, cereri ofertă) sunt în **Neon PostgreSQL** — mereu în cloud
- **Imaginile produselor** sunt pe **Cloudflare R2** (referite prin `mainImageFilename`)
- **Iconurile** (features/specificații) sunt static în `apps/web/public/images/`
- La fiecare save în CMS, un **revalidation hook** invalidează cache-ul ISR pe frontend

---

## Deployment

| Componentă | Platformă | Auto-deploy | URL producție |
|------------|-----------|-------------|---------------|
| Frontend (web) | Vercel | Da, la `git push` | https://haier-web.vercel.app |
| CMS | Railway | Da, la `git push` | https://repocms-production-bc02.up.railway.app |
| Database | Neon | N/A (persistent) | connection string în `.env` |
| Media | Cloudflare R2 | N/A (persistent) | https://pub-3013ff0157c24567adca9dab49d95319.r2.dev |

**Important**: `git push` deployază doar **cod**. Datele din Neon și media din R2 nu sunt afectate.

---

## Running Locally

```bash
# Terminal 1 — CMS
cd apps/cms && pnpm dev          # http://localhost:3001

# Terminal 2 — Frontend
cd apps/web && pnpm dev          # http://localhost:3000
```

CMS-ul local citește/scrie direct în Neon (nu există DB locală).

---

## Environment Variables

### CMS (`apps/cms/.env`)
```
DATABASE_URL=postgresql://...         # Neon connection string
PAYLOAD_SECRET=...                     # Min 32 chars
R2_ENDPOINT=https://...               # Cloudflare R2 (opțional)
R2_BUCKET=haier-media
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
NEXT_PUBLIC_WEB_URL=http://localhost:3000
REVALIDATION_SECRET=...
RESEND_API_KEY=...                     # Email service (opțional)
CONTACT_EMAIL=...
```

### Frontend (`apps/web/.env`)
```
NEXT_PUBLIC_CMS_URL=http://localhost:3001
```

---

## CMS Collections

### Products (`apps/cms/src/collections/Products.ts`)
Câmpuri organizate pe taburi:
- **Main**: title, slug (unique), series, modelCode, capacity, categorySlug, shortDescription, mainImageFilename
- **Răcire**: coolingCapacityNominal/Range, coolingPowerConsumption/Range, seer, eer, energyClassCooling
- **Încălzire**: heatingCapacityNominal/Range, heatingPowerConsumption/Range, scop, cop, energyClassHeating
- **Unitate Interioară**: indoorDimensions, indoorWeight, indoorNoiseMax, indoorNoiseLevels
- **Unitate Exterioară**: outdoorDimensions, outdoorWeight, outdoorNoiseMax, compressorType
- **General**: refrigerant (R32), powerSupply (220-240V/50Hz), warranty (5 ani), madeIn
- **Funcționalități**: featureHighlights
- **Sidebar**: featured (checkbox), order (number)

`energyClassCooling` / `energyClassHeating` — enum: `A+++`, `A++`, `A+`, `A`, `B`, `C`, `D`

### Categories (`apps/cms/src/collections/Categories.ts`)
- name, slug (unique), parent (self-relationship), level (`1`/`2`/`3`), description, image, order
- Revalidation hooks la save/delete

### Inquiries (`apps/cms/src/collections/Inquiries.ts`)
- name, email, phone, product (relationship), message, status (`new`/`contacted`/`completed`)
- Public create, authenticated read/update/delete

### Media (`apps/cms/src/collections/Media.ts`)
- Upload: images + PDF
- Sizes: thumbnail (400×300), card (768×576), hero (1920×1080)

### Users (`apps/cms/src/collections/Users.ts`)
- auth: true, email-based

---

## Frontend Routes

| Route | Pagina |
|-------|--------|
| `/` | Homepage — Hero, TechFeatures, CategoryCarousel, CategoryGrid, FeaturedProducts |
| `/produse` | Lista categorii (CategoryGrid) |
| `/produse/[category]` | Produse din categorie (ProductCard grid) |
| `/produse/[category]/[slug]` | Pagina produs — imagine, specs, ProductFeatures, ProductSpecs, InquiryForm |
| `/contact` | Informații contact |
| `/cerere-oferta` | Formular cerere ofertă standalone |
| `POST /api/inquiry` | Handler formular cerere ofertă → salvează în CMS + email |
| `POST /api/revalidate` | ISR cache invalidation (apelat de CMS hooks) |

---

## Frontend Components

### Layout (`src/components/layout/`)
- **Header.tsx** — Fixed header, transparent→dark pe homepage, solid dark pe restul paginilor. Desktop nav + MobileNav
- **Footer.tsx** — 4 coloane (brand, produse, info, contact) + social links
- **MobileNav.tsx** — Radix Dialog drawer, hamburger menu

### UI (`src/components/ui/`)
- **Container.tsx** — Responsive wrapper (sm/md/lg/xl)
- **Button.tsx** — primary (sky-600), secondary, outline
- **Badge.tsx** — default, success (green), warning (yellow), info (sky)

### Product (`src/components/product/`)
- **ProductCard.tsx** — Card cu animație Framer Motion, imagine R2, badges
- **ProductFeatures.tsx** — 8 carduri cu iconuri din `/images/descriere/`, hover effect (albastru + descriere), label-uri clasă energetică
- **ProductSpecs.tsx** — 38 carduri universale cu iconuri din `/images/specificatii/`, hover effect
- **InquiryForm.tsx** — react-hook-form, validare, POST `/api/inquiry`

### Sections (`src/components/sections/`)
- **Hero.tsx** — Hero homepage cu animații Framer Motion
- **TechFeatures.tsx** — Taburi "Purificare & Igienă" / "Confort & Performanță"
- **CategoryCarousel.tsx** — Scroll horizontal cu categorii predefinite
- **CategoryGrid.tsx** — Grid categorii nivel 1 cu emoji icons
- **FeaturedProducts.tsx** — Grid produse featured

---

## Product JSON Structure (for API import)

```json
{
  "title": "Pearl Plus, 3.5 kW, 12000BTU",
  "slug": "pearl-plus-3-5-kw",
  "series": "Pearl Plus",
  "modelCode": "AS35...",
  "capacity": "3.5 kW",
  "categorySlug": "climatizare",
  "shortDescription": "Descriere scurtă...",
  "mainImageFilename": "imagine.webp",
  "coolingCapacityNominal": "3.5 kW",
  "coolingCapacityRange": "0.8 - 3.6 kW",
  "coolingPowerConsumption": "1.09 kW",
  "coolingPowerRange": "0.4 - 1.3 kW",
  "seer": "6.1",
  "eer": "3.21",
  "energyClassCooling": "A++",
  "heatingCapacityNominal": "3.7 kW",
  "heatingCapacityRange": "0.8 - 4.2 kW",
  "heatingPowerConsumption": "1.00 kW",
  "heatingPowerRange": "0.4 - 1.5 kW",
  "scop": "4.0",
  "cop": "3.71",
  "energyClassHeating": "A+",
  "indoorDimensions": "805 × 200 × 290 mm",
  "indoorWeight": "8.8 kg",
  "indoorNoiseMax": "54 dB",
  "indoorNoiseLevels": "37 / 33 / 28 / 18 dB(A)",
  "outdoorDimensions": "700 × 245 × 544 mm",
  "outdoorWeight": "23.5 kg",
  "outdoorNoiseMax": "63 dB",
  "compressorType": "Inverter Rotativ",
  "refrigerant": "R32",
  "powerSupply": "220-240V/50Hz",
  "warranty": "5 ani",
  "madeIn": null,
  "featureHighlights": null,
  "featured": true,
  "order": 1
}
```

Pentru import bulk, pregătește un array JSON cu toate produsele. Se pot importa automat prin API: `POST /api/products` pe CMS.

---

## Key Libraries

| Pachet | Versiune | Rol |
|--------|----------|-----|
| Next.js | 16.1.6 (web) / 15.1.11 (CMS) | Framework |
| React | 19.2.3 | UI |
| Payload CMS | 3.14.0 | Headless CMS |
| Tailwind CSS | v4 | Styling |
| Framer Motion | 12.15.0 | Animații |
| Radix UI | 1.2+ | Componente accesibile (Dialog, Accordion) |
| React Hook Form | 7.57.0 | Formulare |
| Resend | 6.9.1 | Email |
| Sharp | 0.33.0 | Procesare imagini |
| pnpm | 9.15.0 | Package manager |
| Turbo | 2.8.3 | Monorepo build orchestration |
| PostgreSQL | Neon (cloud) | Bază de date |

---

## Important Notes

- **Payload 3** rulează pe Next.js — NU este Express standalone
- **`@payload-config`** alias obligatoriu în `tsconfig.json` (apps/cms)
- **`sharp`** trebuie importat și pasat la `buildConfig({ sharp })`
- **Params în Next.js 16** sunt `Promise<{ slug: string }>` — trebuie await
- **Schema push** (la dev start) poate modifica structura DB-ului — atenție la warnings cu DATA LOSS
- **`importMap.js`** este auto-generat — dacă dă erori, regenerează cu `npx payload generate:importmap`
- **R2 plugin** este condiționat: `...(process.env.R2_BUCKET ? [s3Storage(...)] : [])`
- **ISR revalidation** funcționează prin tags: `products`, `categories`, `product-{slug}`, `category-{slug}`
