import { lazy } from 'react'

import { Color, Image, Number, Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./ProfilePhoto')),
  {
    type: 'dalton-islamic-center--profile-photo',
    label: 'Custom / Profile Photo',
    props: {
      className: Style({ properties: [Style.Margin] }),
      image: Image({ label: 'Photo', format: Image.Format.WithDimensions }),
      size: Number({ label: 'Size', defaultValue: 150, suffix: 'px', min: 40, max: 500 }),
      borderWidth: Number({ label: 'Border thickness', defaultValue: 0, suffix: 'px', min: 0, max: 20 }),
      borderColor: Color({ label: 'Border color', defaultValue: '#C7B299' }),
      cropY: Number({ label: 'Vertical crop position', defaultValue: 20, suffix: '%', min: 0, max: 100 }),
    },
  }
)
