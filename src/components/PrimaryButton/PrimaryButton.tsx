import { PropsWithChildren } from 'react'
import { Text, View } from '@tarojs/components'

export type PrimaryButtonProps = PropsWithChildren<{
  onClick?: () => void
  className?: string
  title?: string
  description?: string
  icon?: string
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
}>

export function PrimaryButton({
  children,
  onClick,
  className,
  title,
  description,
  icon,
  variant = 'primary',
  fullWidth = true
}: PrimaryButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <View
      className={[
        'rounded-[28rpx] px-5 py-5',
        fullWidth ? 'w-full' : 'inline-flex',
        isPrimary
          ? 'bg-brand text-white shadow-soft border border-[rgba(255,255,255,0.18)]'
          : 'bg-[rgba(255,255,255,0.94)] text-[#0f172a] border border-[rgba(148,163,184,0.2)] shadow-soft',
        'active:opacity-85 active:scale-[0.99]',
        className ?? ''
      ].join(' ')}
      onClick={onClick}
    >
      <View className='flex flex-row items-center gap-4'>
        {icon ? (
          <View
            className={[
              'w-[72rpx] h-[72rpx] rounded-full flex items-center justify-center text-[34rpx]',
              isPrimary ? 'bg-[rgba(255,255,255,0.18)]' : 'bg-[rgba(14,165,233,0.12)]'
            ].join(' ')}
          >
            <Text>{icon}</Text>
          </View>
        ) : null}
        <View className='flex-1'>
          <Text
            className={[
              'block text-[30rpx] font-semibold leading-[1.2]',
              isPrimary ? 'text-white' : 'text-[#0f172a]'
            ].join(' ')}
          >
            {title ?? children}
          </Text>
          {description ? (
            <Text
              className={[
                'block mt-2 text-[24rpx] leading-[1.5]',
                isPrimary ? 'text-[rgba(255,255,255,0.88)]' : 'text-[#64748b]'
              ].join(' ')}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  )
}
