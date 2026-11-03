import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Tool } from '@/lib/tools'
import { ToolCard } from '@/components/tools/ToolCard'
import { toolContent } from '@/lib/tool-content'
import { AdSenseUnit } from '@/components/ads/AdSenseUnit'
import { siteUrl } from '@/lib/site-url'
import { getToolHref } from '@/lib/tools'

interface ToolLayoutProps {
  tool: Tool
  relatedTools: Tool[]
  children: React.ReactNode
}

export function ToolLayout({ tool, relatedTools, children }: ToolLayoutProps) {
  const content = toolContent[tool.slug]
  return (
    <main id="main-content" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
        <Link href="/tools" className="hover:text-indigo-600 dark:hover:text-indigo-400">Tools</Link>
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
        <span className="text-gray-900 dark:text-white font-medium">{tool.name}</span>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: `${siteUrl}/tools` },
              { '@type': 'ListItem', position: 3, name: tool.name, item: `${siteUrl}${getToolHref(tool)}` },
            ],
          }).replace(/</g, '\\u003c'),
        }}
      />

      {/* Tool header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" aria-hidden="true">{tool.icon}</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
      </div>

      {/* Tool interface */}
      {children}

      <AdSenseUnit slot={process.env.NEXT_PUBLIC_ADSENSE_TOOL_PAGE_SLOT} placement={`tool-page-${tool.slug}`} />

      {content && (
        <div className="mt-14 space-y-10">
          <section aria-labelledby="tool-guide-heading">
            <h2 id="tool-guide-heading" className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About {tool.name}
            </h2>
            <div className="max-w-3xl space-y-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              {content.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-5 dark:border-indigo-900 dark:bg-indigo-950/40">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How to use this tool</h3>
              <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{content.guidance}</p>
            </div>
          </section>

          <section aria-labelledby="tool-faq-heading">
            <h2 id="tool-faq-heading" className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-gray-200 dark:divide-gray-800 border-y border-gray-200 dark:border-gray-800">
              {content.faqs.map((faq) => (
                <details key={faq.question} className="group py-4">
                  <summary className="cursor-pointer list-none pr-6 font-medium text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 dark:text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: content.faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                })),
              }).replace(/</g, '\\u003c'),
            }}
          />
        </div>
      )}

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
