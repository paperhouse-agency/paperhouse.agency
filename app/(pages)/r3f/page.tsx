import { Wrapper } from '@/app/(pages)/(components)/wrapper'
import { TheatreProjectProvider } from '@/orchestra/theatre'
import { Box } from './(components)/box'

// Internal demo route — never indexed, not managed from HQ.
export const metadata = {
  title: 'WebGL Demo',
  robots: { index: false, follow: false },
}

export default function Home() {
  return (
    <TheatreProjectProvider id="Satus-R3f" config="/config/Satus-R3f.json">
      <Wrapper theme="light" className="font-mono uppercase" webgl>
        <div className="flex items-center justify-center grow">
          <Box className="size-[250px]" />
        </div>
      </Wrapper>
    </TheatreProjectProvider>
  )
}
