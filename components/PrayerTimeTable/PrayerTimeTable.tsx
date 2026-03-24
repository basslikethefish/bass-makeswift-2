'use client'

import { CSSProperties, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

interface PrayerTime {
  name: string
  time: string
}

interface ImageWithDimensions {
  url: string
  dimensions: { width: number; height: number }
}

interface PrayerTimeTableProps {
  className?: string
  title?: string
  backgroundImage?: ImageWithDimensions
  overlayColor?: string
  overlayOpacity?: number
  headingColor?: string
  textColor?: string
  borderColor?: string
  dividerColor?: string
  decorImage?: ImageWithDimensions
}

function fetchPrayerTimes(): Promise<PrayerTime[] | null> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/api/prayer-times')
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText)
        resolve(data.prayers ?? null)
      } catch {
        resolve(null)
      }
    }
    xhr.onerror = () => resolve(null)
    xhr.send()
  })
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function PrayerTimeTable({
  className,
  title = "Today's Prayer Times",
  backgroundImage,
  overlayColor = '#C7B299',
  overlayOpacity = 80,
  headingColor = '#008CAC',
  textColor = '#008CAC',
  borderColor = '#008CAC',
  dividerColor,
  decorImage,
}: PrayerTimeTableProps) {
  const [prayers, setPrayers] = useState<PrayerTime[] | null>(null)
  const [loading, setLoading] = useState(true)

  const resolvedDividerColor = dividerColor ?? headingColor

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchPrayerTimes()
    setPrayers(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div
      className={className}
      style={
        {
          '--ptt-heading': headingColor,
          '--ptt-text': textColor,
          '--ptt-border': borderColor,
          '--ptt-divider': resolvedDividerColor,
        } as CSSProperties
      }
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          border: '3px solid var(--ptt-border)',
          borderRadius: 16,
          maxWidth: 400,
          margin: '0 auto',
          textAlign: 'center',
          fontFamily: 'inherit',
        }}
      >
        {/* Background image layer */}
        {backgroundImage?.url && (
          <Image
            src={backgroundImage.url}
            alt=""
            width={backgroundImage.dimensions.width}
            height={backgroundImage.dimensions.height}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        )}

        {/* Color overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: overlayColor,
            opacity: overlayOpacity / 100,
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', padding: '32px 28px' }}>
          {/* Title */}
          <h2
            style={{
              color: 'var(--ptt-heading)',
              fontSize: 22,
              fontWeight: 700,
              margin: '0 0 4px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h2>

          {/* Date */}
          <p
            style={{
              color: 'var(--ptt-text)',
              fontSize: 14,
              margin: '0 0 20px',
              opacity: 0.75,
            }}
          >
            {formatDate()}
          </p>

          {/* Decorative icon */}
          {decorImage?.url && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <Image
                src={decorImage.url}
                alt=""
                width={decorImage.dimensions.width}
                height={decorImage.dimensions.height}
                style={{ width: 40, height: 40, objectFit: 'contain' }}
              />
            </div>
          )}

          {/* Prayer times */}
          {loading ? (
            <div style={{ color: 'var(--ptt-text)', fontSize: 14, padding: '20px 0' }}>
              Loading prayer times...
            </div>
          ) : prayers ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {prayers.map((prayer, i) => (
                <div key={prayer.name}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 8px',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--ptt-text)',
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {prayer.name}
                    </span>
                    <span
                      style={{
                        color: 'var(--ptt-heading)',
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      {prayer.time}
                    </span>
                  </div>
                  {i < prayers.length - 1 && (
                    <div
                      style={{
                        height: 1,
                        background: 'var(--ptt-divider)',
                        opacity: 0.3,
                        margin: '0 8px',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--ptt-text)', fontSize: 14, padding: '20px 0' }}>
              Prayer times unavailable.
              <br />
              Please visit{' '}
              <a
                href="https://www.islamicfinder.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--ptt-heading)', textDecoration: 'underline' }}
              >
                islamicfinder.org
              </a>{' '}
              or contact the masjid.
            </div>
          )}

          {/* Footer */}
          <p
            style={{
              color: 'var(--ptt-text)',
              fontSize: 11,
              marginTop: 20,
              opacity: 0.5,
            }}
          >
            Dalton, GA &middot; Source: IslamicFinder
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrayerTimeTable
