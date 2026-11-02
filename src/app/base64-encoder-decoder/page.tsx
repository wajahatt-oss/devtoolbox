import { Base64Client } from '@/components/tool-pages/Base64Client'
import { generateToolMetadata } from '@/lib/seo'

export const metadata = generateToolMetadata('base64-encoder-decoder')

export default function Base64Page() {
  return <Base64Client />
}
