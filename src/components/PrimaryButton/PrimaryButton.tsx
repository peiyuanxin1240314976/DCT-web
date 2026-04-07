import { PropsWithChildren } from 'react'
import { Text, View } from '@tarojs/components'

import './PrimaryButton.css'

export type PrimaryButtonProps = PropsWithChildren<{
  onClick?: () => void
}>

export function PrimaryButton({ children, onClick }: PrimaryButtonProps) {
  return (
    <View className='primary-button' onClick={onClick}>
      <Text className='primary-button__label'>{children}</Text>
    </View>
  )
}
