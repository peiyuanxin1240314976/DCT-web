import { PropsWithChildren } from 'react'
import { Text, View } from '@tarojs/components'

export type PrimaryButtonProps = PropsWithChildren<{
  onClick?: () => void
  className?: string
}>

export function PrimaryButton({ children, onClick, className }: PrimaryButtonProps) {
  return (
    <View
      className={[
        'inline-flex items-center justify-center rounded-xl px-5 py-4',
        'bg-brand text-white text-[28rpx] leading-none shadow-soft',
        'active:opacity-85',
        className ?? ''
      ].join(' ')}
      onClick={onClick}
    >
      <Text className='block'>{children}</Text>
    </View>
  )
}
