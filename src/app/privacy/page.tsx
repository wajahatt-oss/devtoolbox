import type { Metadata } from 'next'
import { generateMetadata as createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Privacy Policy',
  description: 'Learn how DevToolBox handles information, browser-side tool inputs, and basic site operation.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Privacy</p>
        <h1 className="text-3xl font-bold text-gray-950 dark:text-white sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Last updated: November 3, 2026</p>
      </header>
      <div className="space-y-8 text-base leading-7 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Tool input stays in your browser</h2>
          <p>DevToolBox tools are designed to process the text you enter locally in your browser; the tools do not send input to a DevToolBox processing server or store it in an account. The API Request Tester is an exception to browser-only data handling in the practical sense: when you send a request, its URL, headers, and body are sent directly from your browser to the destination you choose. Do not use a shared device for sensitive material or send credentials to destinations you do not trust.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Information involved in delivering the site</h2>
          <p>When you visit a website, your browser necessarily makes network requests to retrieve the page and its assets. The hosting provider or network infrastructure may process standard request information such as an IP address, request time, and requested URL under its own policies. This codebase does not configure an analytics service or an input collection service. Its optional advertising integration is disabled by default and described below.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Browser storage and external resources</h2>
          <p>The appearance setting may be stored in your browser so the selected theme can be restored. Tool inputs are kept in the current page state and are not saved to a DevToolBox account. Some site assets or hosting functionality may be provided by third parties and are subject to their own privacy practices.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Optional advertising integration</h2>
          <p>The codebase contains an optional Google AdSense integration that is disabled by default. If the site owner enables it, the page may load Google scripts and advertising content, and Google or its partners may process request information or use cookies under their own policies. The configuration flag is not a consent interface; advertising must remain disabled unless separate, appropriate consent handling is in place. Tool input is processed separately in your browser and is not sent to an advertising processing API by the tools.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Your choices and changes</h2>
          <p>You can clear page inputs by leaving the page or using the relevant tool controls, and you can clear browser storage through your browser settings. This policy may be updated as the site changes; the date above identifies the current version. This notice describes the current site functionality and is not a guarantee about third-party hosting logs.</p>
        </section>
      </div>
    </main>
  )
}
