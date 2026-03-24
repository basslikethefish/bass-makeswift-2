import { lazy } from 'react'

import { TextInput } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

export const CHAT_WIDGET_COMPONENT_TYPE = 'dalton-islamic-center--chat-widget'

runtime.registerComponent(
  lazy(() => import('./MosqueChatWidget')),
  {
    type: CHAT_WIDGET_COMPONENT_TYPE,
    label: 'Mosque Chat Widget',
    hidden: true,
    props: {
      jummahTime: TextInput({ label: 'Jummah time', defaultValue: '1:30 PM' }),
      sundaySchoolStart: TextInput({ label: 'Sunday school start', defaultValue: '1:00 PM' }),
      sundaySchoolEnd: TextInput({ label: 'Sunday school end', defaultValue: '3:00 PM' }),
      tuition: TextInput({ label: 'Tuition (per semester)', defaultValue: '$XX' }),
      sisMohaContact: TextInput({ label: 'Sister Mona contact info', defaultValue: '' }),
      facebookUrl: TextInput({ label: 'Facebook page URL', defaultValue: '' }),
    },
  }
)
