import { NextResponse } from 'next/server'

import { getPrayerTimesStructured } from '@/lib/prayer-times'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const prayers = await getPrayerTimesStructured()

  if (!prayers) {
    return NextResponse.json({
      prayers: null,
      times: 'Prayer times unavailable. Please visit islamicfinder.org or contact the masjid directly.',
    })
  }

  const times = prayers.map((p) => `- ${p.name}: ${p.time}`).join('\n')

  return NextResponse.json({ prayers, times })
}
