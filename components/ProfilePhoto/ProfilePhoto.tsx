'use client'

import Image from 'next/image'

interface ProfilePhotoProps {
  className?: string
  image?: { url: string; dimensions: { width: number; height: number } }
  size?: number
  borderWidth?: number
  borderColor?: string
  cropPosition?: 'top' | 'center' | 'bottom'
}

export function ProfilePhoto({
  className,
  image,
  size = 150,
  borderWidth = 0,
  borderColor = 'transparent',
  cropPosition = 'top',
}: ProfilePhotoProps) {
  const outerSize = size + borderWidth * 2

  return (
    <div
      className={className}
      style={{
        width: outerSize,
        height: outerSize,
        borderRadius: '50%',
        border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {image?.url ? (
        <Image
          src={image.url}
          alt=""
          width={size}
          height={size}
          style={{
            width: size,
            height: size,
            objectFit: 'cover',
            objectPosition: `center ${cropPosition}`,
            display: 'block',
          }}
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            backgroundColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.35,
            color: '#9ca3af',
          }}
        >
          👤
        </div>
      )}
    </div>
  )
}

export default ProfilePhoto
