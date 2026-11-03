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
| JSON Diff Checker | `/tools/json-diff` |
| Cron Expression Generator | `/tools/cron-generator` |
| JWT Generator (test tokens only) | `/tools/jwt-generator` |
| SQL Query Builder | `/tools/sql-query-builder` |
| API Request Tester | `/tools/api-tester` |
| Regex Explainer | `/tools/regex-explainer` |

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
    ├── site-url.ts                 # Shared canonical site origin
    └── utils.ts
```

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Set environment variables from `.env.example`
4. Deploy

## Privacy

Tool operations run in the browser and are not sent to a DevToolBox processing API. The API Request Tester sends the URL, headers, and body you provide directly from your browser to the destination you choose; normal browser CORS and network rules apply. Normal website delivery also requires network requests; hosting or network providers may process standard request metadata under their own policies. See the [Privacy Policy](/privacy) and [Terms of Service](/terms).

## Advertising

Advertising is outside the current product scope and is disabled by default. The repository contains an optional AdSense integration, but its configuration flags do not provide a consent interface. Keep it disabled unless the site owner separately implements and verifies all required consent handling and obtains any required approval.
