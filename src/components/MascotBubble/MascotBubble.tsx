import { Image, Text, View } from '@tarojs/components'

export type MascotBubbleProps = {
  name?: string
  emoji?: string
  imageUrl?: string
  state?: 'idle' | 'happy' | 'guide'
  message: string
  className?: string
}

/**
 * 轻量占位版卡通人物气泡，后续可把 emoji 替换为真实 IP 形象图。
 */
export function MascotBubble({
  name = '小祈',
  emoji = '🧚',
  imageUrl,
  state = 'guide',
  message,
  className
}: MascotBubbleProps) {
  const motionClass =
    state === 'happy'
      ? 'animate__animated animate__tada'
      : state === 'idle'
        ? 'motion-float-soft'
        : 'animate__animated animate__fadeInUp'

  return (
    <View
      className={[
        'flex items-start gap-3 p-4 rounded-2xl bg-white/90 shadow-soft',
        'animate__animated animate__fadeInUp',
        className ?? ''
      ].join(' ')}
    >
      {imageUrl ? (
        <Image
          className={['w-[76rpx] h-[76rpx] rounded-full object-cover', motionClass].join(' ')}
          src={imageUrl}
          mode='aspectFill'
          lazyLoad
        />
      ) : (
        <View
          className={[
            'w-[76rpx] h-[76rpx] rounded-full bg-[linear-gradient(135deg,var(--brand),var(--brand-2))]',
            'flex items-center justify-center text-[34rpx]',
            state === 'happy' ? 'magictime boingInUp' : motionClass
          ].join(' ')}
        >
          {emoji}
        </View>
      )}
      <View className='flex-1'>
        <Text className='block text-[24rpx] font-semibold text-text mb-1'>{name}</Text>
        <Text className='block text-[25rpx] leading-[1.5] text-[#475569]'>{message}</Text>
      </View>
    </View>
  )
}

