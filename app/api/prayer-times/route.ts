import { NextResponse } from 'next/server'

import { getPrayerTimes } from '@/lib/prayer-times'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const times = await getPrayerTimes()
  return NextResponse.json({ times })
}
