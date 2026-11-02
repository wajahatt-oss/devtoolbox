import { UuidGeneratorClient } from '@/components/tool-pages/UuidGeneratorClient'
import { generateToolMetadata } from '@/lib/seo'

export const metadata = generateToolMetadata('uuid-generator')

export default function UuidGeneratorPage() {
  return <UuidGeneratorClient />
}
