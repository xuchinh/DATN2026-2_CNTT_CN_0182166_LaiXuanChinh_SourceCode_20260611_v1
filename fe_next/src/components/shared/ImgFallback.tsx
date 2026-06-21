'use client'

import { ImgHTMLAttributes } from 'react'

const FALLBACK_SRC = '/images/no-image.svg'

/**
 * Thẻ <img> thường nhưng tự đổi sang ảnh placeholder khi ảnh nguồn lỗi
 * (file đã bị xóa khỏi uploads → 404). Dùng được trong cả server component.
 */
const ImgFallback = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      {...props}
      onError={(e) => {
        const target = e.currentTarget
        if (!target.src.endsWith(FALLBACK_SRC)) {
          target.src = FALLBACK_SRC
        }
      }}
    />
  )
}

export default ImgFallback
