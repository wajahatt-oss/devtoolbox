import type { Metadata } from 'next'
import { generateMetadata as createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Terms of Service',
  description: 'Read the terms and limitations that apply when using the free DevToolBox browser-based utilities.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Terms</p>
        <h1 className="text-3xl font-bold text-gray-950 dark:text-white sm:text-4xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Last updated: November 2, 2026</p>
      </header>
      <div className="space-y-8 text-base leading-7 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Using the tools</h2>
          <p>DevToolBox provides free browser utilities for general development and testing. You are responsible for the content you enter, how you use each result, and ensuring your use complies with applicable law and any obligations to third parties.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No professional or security advice</h2>
          <p>Results are provided for convenience and may be incomplete or unsuitable for a particular purpose. A decoded JWT is not signature-verified, a formatter is not a complete schema validator, and a hash is not encryption or password storage. Verify outputs and use appropriate security review, tests, and authoritative tools before relying on them.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Availability and warranty</h2>
          <p>The site and its tools are provided on an “as available” basis without a promise of uninterrupted operation, error-free results, or fitness for a specific purpose. To the extent allowed by applicable law, DevToolBox disclaims implied warranties and is not responsible for loss resulting from reliance on tool output or service interruption.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Changes to these terms</h2>
          <p>Features and these terms may change as the site develops. Continued use after an updated version is published means you accept the updated terms to the extent permitted by applicable law. If you do not agree, stop using the site.</p>
        </section>
      </div>
    </main>
  )
}
