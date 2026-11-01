# DevToolBox

Free, fast, privacy-friendly online developer tools. All processing happens in your browser — no data is ever sent to a server.

## Live Tools (Phase 1 MVP)

| Tool | URL |
|------|-----|
| JSON Formatter | `/json-formatter` |
| JWT Decoder | `/jwt-decoder` |
| UUID Generator | `/uuid-generator` |
| Base64 Encoder/Decoder | `/base64-encoder-decoder` |
| SQL Formatter | `/sql-formatter` |

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Theme**: next-themes (light/dark/system)
- **SQL parsing**: sql-formatter

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
cd devtoolbox
npm install
```

### Environment

Copy `.env.example` to `.env.local` and fill in values as needed:

```bash
cp .env.example .env.local
```

For Phase 1 (MVP), only `NEXT_PUBLIC_APP_URL` is required.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout (Navbar, Footer, ThemeProvider)
│   ├── globals.css
│   ├── sitemap.ts                  # XML sitemap
│   ├── robots.ts                   # robots.txt
│   ├── tools/page.tsx              # Tools directory
│   ├── json-formatter/page.tsx
│   ├── jwt-decoder/page.tsx
│   ├── uuid-generator/page.tsx
│   ├── base64-encoder-decoder/page.tsx
│   └── sql-formatter/page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeToggle.tsx
│   └── tools/
│       ├── ToolCard.tsx
│       ├── ToolLayout.tsx
│       └── CopyButton.tsx
└── lib/
    ├── tools/
    │   ├── index.ts                # Tool registry
    │   ├── json-formatter.ts
    │   ├── jwt-decoder.ts
    │   ├── uuid-generator.ts
    │   └── base64.ts
    ├── seo.ts
    └── utils.ts
```

## Development Phases

- [x] **Phase 1**: MVP — 5 working tools, homepage, tools directory, dark mode, SEO basics
- [ ] **Phase 2**: SEO landing pages, sitemap, analytics
- [ ] **Phase 3**: Supabase auth, favorites, saved projects
- [ ] **Phase 4**: Stripe subscriptions, pro plan, ads

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Set environment variables from `.env.example`
4. Deploy

## Privacy

All tool processing is done entirely in the browser using standard Web APIs. No user input is transmitted to any backend, analytics, or advertising service.
