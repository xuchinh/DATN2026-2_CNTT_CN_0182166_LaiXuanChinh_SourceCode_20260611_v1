'use client'

import { ImgHTMLAttributes, useState } from 'react'

const FALLBACK_SRC = '/images/no-image.svg'

interface ImgFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  hideOnError?: boolean
}

const ImgFallback = ({ hideOnError, ...props }: ImgFallbackProps) => {
  const [hidden, setHidden] = useState(false)
  if (hidden) return null

  return (
    <img
      {...props}
      onError={(e) => {
        if (hideOnError) {
          setHidden(true)
        } else {
          const target = e.currentTarget
          if (!target.src.endsWith(FALLBACK_SRC)) {
            target.src = FALLBACK_SRC
          }
        }
      }}
    />
  )
}

export default ImgFallback
