import { View, Text } from '@tarojs/components'

import { PageContainer } from '@/components'

/**
 * P0：占位页。后续按 DESIGN_PROCESS 增加签到、动画、分享等，不接付费。
 */
export default function Incense() {
  return (
    <PageContainer className='min-h-screen px-6 pt-8 pb-12 bg-white'>
      <Text className='block text-[36rpx] font-bold text-text mb-5 animate__animated animate__fadeInUp'>
        免费香火
      </Text>
      <Text className='block text-[28rpx] leading-[1.6] text-[#334155] animate__animated animate__fadeInUp animate__delay-1s'>
        此处为 P0 占位：后续可接每日额度、轻动画与分享图，不涉及支付。
      </Text>
    </PageContainer>
  )
}
