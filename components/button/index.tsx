import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from '@/components/link'
import ArrowTopRight from '@/public/arrow-top-right.svg'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center transition-colors duration-500 rounded-full',
  {
    variants: {
      variant: {
        default: 'text-offwhite',
        tertiary: 'p-0 mono-wide',
        outline: 'border-2',
      },
      color: {
        primary: '',
        secondary: '',
        neutral: '',
      },
      size: {
        sm: 'body',
        md: 'body-large',
        lg: 'body-large',
      },
      hasIcon: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Default variant colors
      {
        variant: 'default',
        color: 'primary',
        className: 'bg-primary text-offwhite hover:bg-primary/90',
      },
      {
        variant: 'default',
        color: 'secondary',
        className: 'bg-secondary text-offwhite',
      },
      {
        variant: 'default',
        color: 'neutral',
        className: 'bg-bluishgray text-primary',
      },
      // Outline variant colors
      {
        variant: 'outline',
        color: 'primary',
        className: 'border-primary text-primary',
      },
      {
        variant: 'outline',
        color: 'secondary',
        className: 'border-secondary text-secondary',
      },
      {
        variant: 'outline',
        color: 'neutral',
        className: 'border-bluishgray text-text',
      },
      // Tertiary variant colors
      {
        variant: 'tertiary',
        color: 'primary',
        className: 'text-primary',
      },
      {
        variant: 'tertiary',
        color: 'secondary',
        className: 'text-secondary',
      },
      {
        variant: 'tertiary',
        color: 'neutral',
        className: 'text-text',
      },
      // Size padding for default and outline variants (without icon)
      {
        variant: ['default', 'outline'],
        size: 'sm',
        hasIcon: false,
        className: 'px-3 py-1.5',
      },
      {
        variant: ['default', 'outline'],
        size: 'md',
        hasIcon: false,
        className: 'px-5 py-2.5',
      },
      {
        variant: ['default', 'outline'],
        size: 'lg',
        hasIcon: false,
        className: 'px-[30px] py-5',
      },
      // Size padding with icon
      {
        variant: ['default', 'outline'],
        size: 'sm',
        hasIcon: true,
        className: 'py-1.5 pr-1.5 pl-3',
      },
      {
        variant: ['default', 'outline'],
        size: 'md',
        hasIcon: true,
        className: 'py-2 pr-2 pl-4',
      },
      {
        variant: ['default', 'outline'],
        size: 'lg',
        hasIcon: true,
        className: 'py-2 pr-2 pl-[30px]',
      },
    ],
    defaultVariants: {
      variant: 'default',
      color: 'primary',
      size: 'md',
      hasIcon: false,
    },
  }
)

const iconWrapperVariants = cva(
  'flex items-center justify-center rounded-full',
  {
    variants: {
      size: {
        sm: 'w-[18px] h-[18px]',
        md: 'w-[30px] h-[30px]',
        lg: 'w-[50px] h-[50px]',
      },
      color: {
        primary: 'bg-accent text-white',
        secondary: 'bg-bluishgray text-secondary',
        neutral: 'bg-white text-primary',
      },
      variant: {
        default: '',
        outline: '',
        tertiary: 'bg-primary! text-white!',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      color: 'primary',
    },
  }
)

const iconVariants = cva('', {
  variants: {
    size: {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-6 h-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

type BaseButtonProps = VariantProps<typeof buttonVariants> & {
  children: ReactNode
  hasIcon?: boolean
  className?: string
}

type LinkButtonProps = BaseButtonProps & {
  url: string
  isExternal?: boolean
}

type ButtonElementProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    url?: never
    isExternal?: never
  }

export type ButtonProps = LinkButtonProps | ButtonElementProps

export function Button({
  variant = 'default',
  color = 'primary',
  size = 'md',
  hasIcon = false,
  isExternal = false,
  className,
  url,
  children,
  ...props
}: ButtonProps) {
  let gapClass = ''
  if (size === 'lg') {
    gapClass = 'gap-4'
  } else if (hasIcon) {
    gapClass = 'gap-2.5'
  }

  const buttonContent = (
    <span className={`flex items-center ${gapClass}`}>
      <span>{children}</span>
      {hasIcon && variant !== 'outline' && (
        <span className={iconWrapperVariants({ size, variant, color })}>
          <ArrowTopRight className={iconVariants({ size })} />
        </span>
      )}
    </span>
  )

  if (url) {
    return (
      <Link
        href={url}
        className={buttonVariants({ variant, color, size, hasIcon, className })}
        {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {buttonContent}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={buttonVariants({ variant, color, size, hasIcon, className })}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {buttonContent}
    </button>
  )
}
