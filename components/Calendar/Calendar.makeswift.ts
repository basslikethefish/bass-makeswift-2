import { lazy } from 'react'

import { List, Shape, Slot, Style, TextInput } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./Calendar')),
  {
    type: 'Calendar',
    label: 'Custom / Calendar',
    props: {
      className: Style({ properties: Style.All }),
    },
  }
)
