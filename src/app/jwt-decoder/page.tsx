import { JwtDecoderClient } from '@/components/tool-pages/JwtDecoderClient'
import { generateToolMetadata } from '@/lib/seo'

export const metadata = generateToolMetadata('jwt-decoder')

export default function JwtDecoderPage() {
  return <JwtDecoderClient />
}
