'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

const FALLBACK_SRC = '/images/no-image.svg'

/**
 * Bọc next/image: nếu ảnh nguồn lỗi (file đã bị xóa khỏi uploads → 404)
 * hoặc src rỗng thì hiển thị ảnh placeholder "Không có ảnh" thay vì ảnh vỡ.
 */
const ImageWithFallback = (props: ImageProps) => {
  const { src, alt, className, fill, style, ...rest } = props
  const [errored, setErrored] = useState(false)

  if (errored || !src) {
    // Dùng thẻ img thường cho ảnh fallback để tránh phải cấu hình next/image cho SVG
    return (
      <img
        src={FALLBACK_SRC}
        alt={alt || 'Không có ảnh'}
        className={className}
        style={
          fill
            ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }
            : style
        }
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      style={style}
      onError={() => setErrored(true)}
      {...rest}
    />
  )
}

export default ImageWithFallback
