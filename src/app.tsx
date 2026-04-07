import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'

import './app.css'
import './styles/theme.css'
import './styles/motion.css'

import 'animate.css'
import 'hint.css'
import './styles/vendor/magic.min.css'

function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    console.log('App launched.')
  })

  return children
}

export default App
