const ISLAMICFINDER_URL =
  'https://www.islamicfinder.org/prayer-times/?country=US&state=Georgia&city=Dalton&lat=34.7698&lng=-84.9702&timezone=America%2FNew_York'

const FALLBACK =
  'Prayer times unavailable. Please visit islamicfinder.org or contact the masjid directly.'

const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const

let cache: { date: string; times: string } | null = null

function parsePrayerTimes(html: string): string | null {
  try {
    const times: string[] = []

    for (const name of PRAYER_NAMES) {
      const namePattern = new RegExp(
        `${name}[\\s\\S]{0,500}?(\\d{1,2}:\\d{2}\\s*[APap][Mm])`,
        'i'
      )
      const match = html.match(namePattern)
      if (match?.[1]) {
        times.push(`- ${name}: ${match[1].trim()}`)
      }
    }

    return times.length === PRAYER_NAMES.length ? times.join('\n') : null
  } catch {
    return null
  }
}

async function fetchFromSource(): Promise<string> {
  try {
    const res = await fetch(ISLAMICFINDER_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html',
      },
    })

    if (!res.ok) return FALLBACK

    const html = await res.text()
    return parsePrayerTimes(html) ?? FALLBACK
  } catch {
    return FALLBACK
  }
}

export async function getPrayerTimes(): Promise<string> {
  const today = new Date().toDateString()

  if (cache && cache.date === today) {
    return cache.times
  }

  const times = await fetchFromSource()
  cache = { date: today, times }

  return times
}
