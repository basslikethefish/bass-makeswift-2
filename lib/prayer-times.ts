const ISLAMICFINDER_URL =
  'https://www.islamicfinder.org/prayer-times/?country=US&state=Georgia&city=Dalton&lat=34.7698&lng=-84.9702&timezone=America%2FNew_York'

const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const

export type PrayerName = (typeof PRAYER_NAMES)[number]

export interface PrayerTime {
  name: PrayerName
  time: string
}

interface CacheEntry {
  date: string
  prayers: PrayerTime[] | null
}

let cache: CacheEntry | null = null

function parsePrayerTimes(html: string): PrayerTime[] | null {
  try {
    const prayers: PrayerTime[] = []

    for (const name of PRAYER_NAMES) {
      const namePattern = new RegExp(
        `${name}[\\s\\S]{0,500}?(\\d{1,2}:\\d{2}\\s*[APap][Mm])`,
        'i'
      )
      const match = html.match(namePattern)
      if (match?.[1]) {
        prayers.push({ name, time: match[1].trim() })
      }
    }

    return prayers.length === PRAYER_NAMES.length ? prayers : null
  } catch {
    return null
  }
}

async function fetchFromSource(): Promise<PrayerTime[] | null> {
  try {
    const res = await fetch(ISLAMICFINDER_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html',
      },
    })

    if (!res.ok) return null

    const html = await res.text()
    return parsePrayerTimes(html)
  } catch {
    return null
  }
}

export async function getPrayerTimesStructured(): Promise<PrayerTime[] | null> {
  const today = new Date().toDateString()

  if (cache && cache.date === today) {
    return cache.prayers
  }

  const prayers = await fetchFromSource()
  cache = { date: today, prayers }

  return prayers
}

export async function getPrayerTimes(): Promise<string> {
  const prayers = await getPrayerTimesStructured()

  if (!prayers) {
    return 'Prayer times unavailable. Please visit islamicfinder.org or contact the masjid directly.'
  }

  return prayers.map((p) => `- ${p.name}: ${p.time}`).join('\n')
}
