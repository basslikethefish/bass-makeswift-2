import { lazy } from 'react'

import { List, Shape, Slot, Style, TextInput } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./Input')),
  {
    type: 'Input',
    label: 'Custom / Input',
    props: {
      className: Style({ properties: Style.All }),
    },
  }
)
