import { lazy } from 'react'

import { Color, Style, TextInput } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./PrayerTimeTable')),
  {
    type: 'dalton-islamic-center--prayer-time-table',
    label: 'Custom / Prayer Time Table',
    props: {
      className: Style({ properties: [Style.Margin, Style.Width] }),
      title: TextInput({ label: 'Title', defaultValue: "Today's Prayer Times" }),
      cardBackground: Color({ label: 'Card background', defaultValue: '#C7B299' }),
      headingColor: Color({ label: 'Heading / time color', defaultValue: '#008CAC' }),
      textColor: Color({ label: 'Label color', defaultValue: '#008CAC' }),
      accentColor: Color({ label: 'Accent (star / default divider)', defaultValue: '#008CAC' }),
      borderColor: Color({ label: 'Border color', defaultValue: '#008CAC' }),
      dividerColor: Color({ label: 'Divider color (overrides accent)' }),
    },
  }
)
