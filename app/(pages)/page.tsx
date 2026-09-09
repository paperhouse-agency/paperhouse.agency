import { JsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/libs/seo/metadata'
import { HomeContent } from './home-content'

export const generateMetadata = () => buildMetadata('/')

export default function HomePage() {
  return (
    <>
      <JsonLd slug="/" />
      <HomeContent />
    </>
  )
}
