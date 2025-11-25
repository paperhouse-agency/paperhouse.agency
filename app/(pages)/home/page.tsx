import { Button } from '~/components/button'
import { Wrapper } from '../(components)/wrapper'

export default function Home() {
  return (
    <Wrapper lenis={{}}>
      <h1 className="heading-1">Home</h1>
      <div className="flex justify-center">
        <Button>Click Me</Button>
      </div>
    </Wrapper>
  )
}
