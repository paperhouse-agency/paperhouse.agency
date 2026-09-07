import { JsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/libs/seo/metadata'
import { Wrapper } from '../(components)/wrapper'

export const generateMetadata = () => buildMetadata('/about')

export default function AboutPage() {
  return (
    <>
      <JsonLd slug="/about" />
      <Wrapper>
        <section className="py-15 px-5">
          <div className="wrapper mx-auto">
            <h1 className="heading-1 text-text">About</h1>
          </div>
        </section>
      </Wrapper>
    </>
  )
}
