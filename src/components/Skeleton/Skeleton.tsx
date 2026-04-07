import { View } from '@tarojs/components'

export type SkeletonProps = {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <View
      className={[
        'rounded-xl bg-[rgba(148,163,184,0.18)] overflow-hidden relative',
        'animate__animated animate__fadeIn',
        className ?? ''
      ].join(' ')}
    >
      <View className='absolute inset-0 animate-pulse bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]' />
    </View>
  )
}

