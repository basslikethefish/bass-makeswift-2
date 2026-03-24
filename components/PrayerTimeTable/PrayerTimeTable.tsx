'use client'

import { CSSProperties, useCallback, useEffect, useState } from 'react'

interface PrayerTime {
  name: string
  time: string
}

interface PrayerTimeTableProps {
  className?: string
  title?: string
  cardBackground?: string
  headingColor?: string
  textColor?: string
  accentColor?: string
  borderColor?: string
  dividerColor?: string
}

const PRAYER_ICONS: Record<string, string> = {
  Fajr: '🌅',
  Sunrise: '☀️',
  Dhuhr: '🕐',
  Asr: '🌤️',
  Maghrib: '🌇',
  Isha: '🌙',
}

function IslamicStar({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35"
        fill="none"
        stroke={color}
        strokeWidth="3"
      />
      <polygon
        points="50,15 58,38 82,38 63,53 71,78 50,63 29,78 37,53 18,38 42,38"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  )
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
  cardBackground = '#C7B299',
  headingColor = '#008CAC',
  textColor = '#008CAC',
  accentColor = '#008CAC',
  borderColor = '#008CAC',
  dividerColor,
}: PrayerTimeTableProps) {
  const [prayers, setPrayers] = useState<PrayerTime[] | null>(null)
  const [loading, setLoading] = useState(true)

  const resolvedDividerColor = dividerColor ?? accentColor

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
          '--ptt-card-bg': cardBackground,
          '--ptt-heading': headingColor,
          '--ptt-text': textColor,
          '--ptt-accent': accentColor,
          '--ptt-border': borderColor,
          '--ptt-divider': resolvedDividerColor,
        } as CSSProperties
      }
    >
      <div
        style={{
          background: 'var(--ptt-card-bg)',
          border: '3px solid var(--ptt-border)',
          borderRadius: 16,
          padding: '32px 28px',
          maxWidth: 400,
          margin: '0 auto',
          textAlign: 'center',
          fontFamily: 'inherit',
        }}
      >
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

        {/* Decorative star */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <IslamicStar color={accentColor} />
        </div>

        {/* Prayer times */}
        {loading ? (
          <div style={{ color: 'var(--ptt-text)', fontSize: 14, padding: '20px 0' }}>
            Loading prayer times...
          </div>
        ) : prayers ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{PRAYER_ICONS[prayer.name] ?? '🕋'}</span>
                    <span
                      style={{
                        color: 'var(--ptt-text)',
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {prayer.name}
                    </span>
                  </div>
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
  )
}

export default PrayerTimeTable
