import { PropsWithChildren } from 'react'
import { View } from '@tarojs/components'

import { getThemeName } from '@/store/theme'

export type PageContainerProps = PropsWithChildren<{
  className?: string
}>

export function PageContainer({ className, children }: PageContainerProps) {
  const theme = getThemeName()
  return <View className={`app theme-${theme} ${className ?? ''}`}>{children}</View>
}

