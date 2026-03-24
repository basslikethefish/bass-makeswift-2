import { NextRequest, NextResponse } from 'next/server'

import { getPrayerTimes } from '@/lib/prayer-times'

export const runtime = 'nodejs'

interface ChatConfig {
  jummahTime: string
  sundaySchoolStart: string
  sundaySchoolEnd: string
  tuition: string
  sisMohaContact: string
  facebookUrl: string
}

function buildSystemPrompt(prayerTimes: string, config: ChatConfig): string {
  return `You are the friendly AI assistant for Dalton Islamic Center, located at 2054 Dug Gap Rd, Dalton, GA 30720.
Answer questions warmly and concisely. End responses with "Jazakallah Khair" when appropriate.
If you don't know something, direct the visitor to reach out via Facebook or visit the masjid.

TODAY'S PRAYER TIMES (scraped from IslamicFinder for Dalton, GA):
${prayerTimes}

JUMMAH (FRIDAY PRAYER):
- Time: ${config.jummahTime}
- Entry requires a key card. Please arrange access in advance.

SUNDAY ISLAMIC SCHOOL:
- Hours: ${config.sundaySchoolStart} – ${config.sundaySchoolEnd} every Sunday
- Tuition: ${config.tuition} per semester
- Lunch is included
- To enroll, contact Sister Mona: ${config.sisMohaContact}

UPDATES & ANNOUNCEMENTS:
- Follow us on Facebook: ${config.facebookUrl}

CEMETERY & FUNERAL SERVICES:
- Dalton Islamic Center has a cemetery. Families may inquire about burial arrangements by contacting the masjid.
- We offer funeral (Janazah) services. Please reach out directly for arrangements.

SECURITY:
- Entry into the mosque is gated and requires a key card. Please contact the masjid to arrange access.

GENERAL:
- Address: 2054 Dug Gap Rd, Dalton, GA 30720
- For anything not covered here, visitors should reach out via Facebook or visit in person.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, config } = body as {
      messages: { role: 'user' | 'assistant'; content: string }[]
      config: ChatConfig
    }

    if (!messages?.length) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY is not set')
      return NextResponse.json({ error: 'Service not configured' }, { status: 500 })
    }

    const prayerTimes = await getPrayerTimes()
    const systemPrompt = buildSystemPrompt(prayerTimes, config)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Anthropic API error:', response.status, errorBody)
      return NextResponse.json(
        { error: 'AI service error. Please try again.' },
        { status: 502 }
      )
    }

    const data = await response.json()
    const reply =
      data.content?.[0]?.type === 'text'
        ? data.content[0].text
        : 'I could not generate a response.'

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
