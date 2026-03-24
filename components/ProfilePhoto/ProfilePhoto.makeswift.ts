import { lazy } from 'react'

import { Color, Image, Number, Select, Style } from '@makeswift/runtime/controls'

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
      cropPosition: Select({
        label: 'Crop position',
        options: [
          { value: 'top', label: 'Top (faces)' },
          { value: 'center', label: 'Center' },
          { value: 'bottom', label: 'Bottom' },
        ],
        defaultValue: 'top',
      }),
    },
  }
)
