import { lazy } from 'react'

import { Color, Image, Number, Style, TextInput } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./PrayerTimeTable')),
  {
    type: 'dalton-islamic-center--prayer-time-table',
    label: 'Custom / Prayer Time Table',
    props: {
      className: Style({ properties: [Style.Margin, Style.Width] }),
      title: TextInput({ label: 'Title', defaultValue: "Today's Prayer Times" }),
      backgroundImage: Image({ label: 'Card background image' }),
      overlayColor: Color({ label: 'Overlay color', defaultValue: '#C7B299' }),
      overlayOpacity: Number({ label: 'Overlay opacity', defaultValue: 80, suffix: '%', min: 0, max: 100 }),
      headingColor: Color({ label: 'Heading / time color', defaultValue: '#008CAC' }),
      textColor: Color({ label: 'Label color', defaultValue: '#008CAC' }),
      borderColor: Color({ label: 'Border color', defaultValue: '#008CAC' }),
      dividerColor: Color({ label: 'Divider color' }),
      decorImage: Image({ label: 'Decorative icon' }),
    },
  }
)
