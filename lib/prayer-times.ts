const ALADHAN_URL =
  'https://api.aladhan.com/v1/timings?latitude=34.7698&longitude=-84.9702&method=4&school=0'

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

function to12Hour(time24: string): string {
  const [hourStr, minuteStr] = time24.split(':')
  let hour = parseInt(hourStr, 10)
  const minute = minuteStr.replace(/\s*\(.*\)/, '')
  const ampm = hour >= 12 ? 'PM' : 'AM'
  if (hour === 0) hour = 12
  else if (hour > 12) hour -= 12
  return `${hour}:${minute} ${ampm}`
}

async function fetchFromAladhan(): Promise<PrayerTime[] | null> {
  try {
    const res = await fetch(ALADHAN_URL, { redirect: 'follow' })

    if (!res.ok) return null

    const data = await res.json()
    const timings = data?.data?.timings

    if (!timings) return null

    const prayers: PrayerTime[] = []
    for (const name of PRAYER_NAMES) {
      const raw = timings[name]
      if (!raw) return null
      prayers.push({ name, time: to12Hour(raw) })
    }

    return prayers
  } catch {
    return null
  }
}

export async function getPrayerTimesStructured(): Promise<PrayerTime[] | null> {
  const today = new Date().toDateString()

  if (cache && cache.date === today) {
    return cache.prayers
  }

  const prayers = await fetchFromAladhan()
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
