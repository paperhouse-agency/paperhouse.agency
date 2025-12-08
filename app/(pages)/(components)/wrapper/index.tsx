import cn from 'clsx'
import type { LenisOptions } from 'lenis'
import type { ComponentProps } from 'react'
import type { ThemeName } from '@/styles/config'
import { Canvas } from '@/webgl/components/canvas'
import { Footer } from '../footer'
import { Lenis } from '../lenis'
import { Header } from '../header'
import { Theme } from '../theme'

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: ThemeName
  lenis?: boolean | LenisOptions
  webgl?: boolean | Omit<ComponentProps<typeof Canvas>, 'children'>
}

export function Wrapper({
  children,
  theme = 'light',
  className,
  lenis = true,
  webgl,
  ...props
}: WrapperProps) {
  return (
    <Theme theme={theme} global>
      {webgl && <Canvas root {...(typeof webgl === 'object' && webgl)} />}
      <Header />
      <main className={cn('relative flex flex-col grow', className)} {...props}>
        {children}
      </main>
      <Footer />
      {lenis && <Lenis root options={typeof lenis === 'object' ? lenis : {}} />}
    </Theme>
  )
}
