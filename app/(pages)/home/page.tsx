import { Button } from '~/components/button'
import { Wrapper } from '../(components)/wrapper'

export default function Home() {
  return (
    <Wrapper lenis={{}}>
      <div className="wrapper mx-auto py-24">
        <div className="grid grid-cols-2">
          <div className="flex flex-col gap-5">
            <h1 className="heading-1">
              AI—Driven <span className="text-primary">creative</span> agency,
              based in Dhaka
            </h1>
            <p className="body-large text-text/60 pb-3">
              We help brands and company in marketing solution. As a cause-led
              digital marketing and brand agency, we harness the power of
              technology and creativity to drive positive feedback.
            </p>
            <div className="flex items-center justify-start gap-5">
              <Button size="lg">Schedule a call</Button>
              <Button size="lg" color="neutral" hasIcon>
                Explore Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
