# DevToolBox

Free, fast, privacy-friendly online developer tools. Tool inputs are processed in your browser and are not sent to a DevToolBox processing API.

## Tools

| Tool | URL |
|------|-----|
| JSON Formatter | `/json-formatter` |
| JWT Decoder | `/jwt-decoder` |
| UUID Generator | `/uuid-generator` |
| Base64 Encoder/Decoder | `/base64-encoder-decoder` |
| SQL Formatter | `/sql-formatter` |
| URL Encoder/Decoder | `/url-encoder-decoder` |
| XML Formatter | `/xml-formatter` |
| HTML Formatter | `/html-formatter` |
| CSS Minifier | `/css-minifier` |
| Regex Tester | `/regex-tester` |
| Markdown Previewer | `/markdown-previewer` |
| JSON to CSV Converter | `/json-to-csv` |
| Timestamp Converter | `/timestamp-converter` |
| Hash Generator | `/hash-generator` |
| Diff Checker | `/diff-checker` |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Theme**: next-themes (light/dark/system)
- **SQL parsing**: sql-formatter

## Getting Started

### Prerequisites

- Node.js 22.6+
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

`NEXT_PUBLIC_APP_URL` sets the canonical URL used in page metadata, `sitemap.xml`, and `robots.txt`.

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

### Tests

```bash
npm test
npm run lint
```

Tests cover valid and invalid input for every added tool.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout (Navbar, Footer, ThemeProvider)
│   ├── globals.css
│   ├── sitemap.ts                  # XML sitemap
│   ├── robots.ts                   # robots.txt
│   ├── [slug]/page.tsx             # New statically generated tool pages
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
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
│   └── tool-pages/                 # Existing interactive tool interfaces
└── lib/
    ├── tools/
    │   ├── index.ts                # Tool registry
    │   ├── json-formatter.ts
    │   ├── jwt-decoder.ts
    │   ├── uuid-generator.ts
    │   ├── base64.ts
    │   └── new-tools.ts
    ├── tool-content.ts             # Per-tool SEO text and FAQs
    ├── seo.ts
    └── utils.ts
```

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Set environment variables from `.env.example`
4. Deploy

## Privacy

Tool operations run in the browser, and their input is not sent to a DevToolBox processing API. Normal website delivery still requires network requests; hosting or network providers may process standard request metadata under their own policies. See the [Privacy Policy](/privacy) and [Terms of Service](/terms).

## Google AdSense

AdSense is disabled by default. The official Google script and ad units are omitted unless all of the following are true:

1. `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` is a valid `ca-pub-...` publisher ID.
2. Google has approved the website and `NEXT_PUBLIC_ADSENSE_APPROVED=true` is explicitly set.
3. The required consent handling is configured and `NEXT_PUBLIC_ADSENSE_CONSENT_READY=true` is explicitly set.

After approval, assign Google ad-unit slot IDs to `NEXT_PUBLIC_ADSENSE_HOME_SLOT`, `NEXT_PUBLIC_ADSENSE_TOOLS_SLOT`, and/or `NEXT_PUBLIC_ADSENSE_TOOL_PAGE_SLOT` to enable those manual placements. Ad components render nothing when disabled or when a slot is unset. Do not enable AdSense before approval and consent compliance are in place.

`public/ads.txt` intentionally contains no seller declaration yet: the seller relationship must be confirmed before adding the Google-provided record. Do not guess whether the relationship is `DIRECT` or `RESELLER`.
