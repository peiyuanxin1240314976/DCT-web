import { View, Text } from '@tarojs/components'

import { PageContainer } from '@/components'

/**
 * P0：占位页。后续按 DESIGN_PROCESS 增加签到、动画、分享等，不接付费。
 */
export default function Incense() {
  return (
    <PageContainer className='min-h-screen px-6 pt-8 pb-12 bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_42%,#fff7ed_100%)]'>
      <View className='rounded-[32rpx] bg-[rgba(255,255,255,0.94)] px-5 py-6 shadow-soft border border-[rgba(251,191,36,0.22)] animate__animated animate__fadeInUp'>
        <View className='mb-4 inline-flex rounded-full bg-[rgba(251,191,36,0.12)] px-4 py-2'>
          <Text className='text-[22rpx] font-medium text-[#b45309]'>P0 轻体验页</Text>
        </View>
        <Text className='block text-[42rpx] font-bold text-text'>免费香火</Text>
        <Text className='block mt-3 text-[26rpx] leading-[1.6] text-[#475569]'>
          这一页先保留“轻一点、慢一点”的仪式感，不接支付，只留下温和体验入口。
        </Text>
      </View>

      <View className='mt-5 rounded-[28rpx] bg-[linear-gradient(135deg,#fff7ed_0%,#fffbeb_100%)] px-5 py-6 border border-[rgba(251,191,36,0.25)] animate__animated animate__fadeInUp animate__delay-1s'>
        <Text className='block text-[30rpx] font-semibold text-[#9a3412]'>当前可理解为</Text>
        <Text className='block mt-3 text-[26rpx] leading-[1.75] text-[#7c2d12]'>
          一次不带付款压力的停留。先让用户感受到页面氛围，后续再逐步增加每日额度、祝语、分享图等轻互动。
        </Text>
      </View>

      <View className='mt-5 flex flex-col gap-4 animate__animated animate__fadeInUp animate__delay-2s'>
        <View className='rounded-[26rpx] bg-[rgba(255,255,255,0.92)] px-5 py-5 shadow-soft'>
          <Text className='text-[28rpx] font-semibold text-[#0f172a]'>1. 点亮一盏心灯</Text>
          <Text className='mt-2 block text-[24rpx] leading-[1.6] text-[#64748b]'>
            用一句轻提示或小动画代替复杂流程，让进入门槛足够低。
          </Text>
        </View>
        <View className='rounded-[26rpx] bg-[rgba(255,255,255,0.92)] px-5 py-5 shadow-soft'>
          <Text className='text-[28rpx] font-semibold text-[#0f172a]'>2. 留下一句愿望</Text>
          <Text className='mt-2 block text-[24rpx] leading-[1.6] text-[#64748b]'>
            后续可以补简短文案输入，但当前先保留情绪氛围与说明内容。
          </Text>
        </View>
        <View className='rounded-[26rpx] bg-[rgba(255,255,255,0.92)] px-5 py-5 shadow-soft'>
          <Text className='text-[28rpx] font-semibold text-[#0f172a]'>3. 保存一份安静感</Text>
          <Text className='mt-2 block text-[24rpx] leading-[1.6] text-[#64748b]'>
            未来可接分享卡片或日签，不急着做重功能，先把体验感立住。
          </Text>
        </View>
      </View>

      <View className='mt-6 rounded-[24rpx] bg-[rgba(255,255,255,0.72)] px-5 py-4 border border-[rgba(226,232,240,0.9)]'>
        <Text className='block text-[23rpx] leading-[1.6] text-[#64748b]'>
          当前版本不涉及支付与订单，仅用于展示方向与前后端联调成果。
        </Text>
      </View>
    </PageContainer>
  )
}
