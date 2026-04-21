import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'

import { PrimaryButton } from '@/components'
import { PageContainer } from '@/components'
import { TypingText } from '@/components/TypingText/TypingText'
import { MascotBubble } from '@/components'

const TIPS = [
  '今日份温柔已送达 ✿',
  '点一盏心灯，不急不躁～',
  '地图里藏着你的家乡吗？',
  '免费香火，只为陪你慢下来'
]

export default function Index() {
  useLoad(() => {
    console.log('Home loaded.')
  })

  return (
    <PageContainer className='min-h-screen px-6 pt-8 pb-12 bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_34%,#eef8ff_100%)]'>
      <View className='mb-6 rounded-[32rpx] bg-[rgba(255,255,255,0.92)] px-5 py-6 shadow-soft border border-[rgba(125,211,252,0.18)] animate__animated animate__fadeInUp'>
        <View className='mb-4 inline-flex self-start rounded-full bg-[rgba(14,165,233,0.1)] px-4 py-2'>
          <Text className='text-[22rpx] font-medium text-[#0369a1]'>今日宜慢一点</Text>
        </View>
        <Text className='block mb-3 text-[48rpx] font-bold text-[#0f172a]'>
          心灵小憩
        </Text>
        <TypingText
          className='block text-[28rpx] leading-[1.6] text-[#475569]'
          text='慢下来，逛逛庙、看看地图，什么都不买也没关系～'
          cps={16}
        />
        <View className='mt-5 flex flex-row flex-wrap gap-3'>
          <View className='rounded-full bg-[#ecfeff] px-4 py-2'>
            <Text className='text-[22rpx] text-[#0f766e]'>地图漫游</Text>
          </View>
          <View className='rounded-full bg-[#eff6ff] px-4 py-2'>
            <Text className='text-[22rpx] text-[#1d4ed8]'>寺庙浏览</Text>
          </View>
          <View className='rounded-full bg-[#fff7ed] px-4 py-2'>
            <Text className='text-[22rpx] text-[#c2410c]'>免费香火</Text>
          </View>
        </View>
      </View>

      <MascotBubble
        className='mb-6'
        name='小祈'
        emoji='🌟'
        state='idle'
        message='嘿～今天想先逛地图，还是先点一盏免费的心灯呀？'
      />

      <View className='mb-4 flex flex-row items-center justify-between px-1'>
        <Text className='text-[28rpx] font-semibold text-[#0f172a]'>轻提醒</Text>
        <Text className='text-[22rpx] text-[#64748b]'>左右滑动看看</Text>
      </View>
      <Swiper
        className='h-[120rpx] mb-8 animate__animated animate__fadeInUp animate__delay-1s'
        autoplay
        circular
        interval={3200}
        vertical={false}
      >
        {TIPS.map((t) => (
          <SwiperItem key={t}>
            <View className='h-[120rpx] px-5 rounded-[26rpx] bg-[rgba(255,255,255,0.94)] shadow-soft border border-[rgba(125,211,252,0.3)] flex items-center justify-center'>
              <Text className='text-[28rpx] font-medium text-[#0e7490] text-center'>{t}</Text>
            </View>
          </SwiperItem>
        ))}
      </Swiper>

      <View className='mb-4 px-1'>
        <Text className='block text-[30rpx] font-semibold text-[#0f172a]'>现在开始</Text>
        <Text className='block mt-1 text-[24rpx] leading-[1.5] text-[#64748b]'>
          先选一个入口，轻量逛一圈就好。
        </Text>
      </View>

      <View className='flex flex-col gap-4 animate__animated animate__fadeInUp animate__delay-2s'>
        <PrimaryButton
          className='motion-pulse-scale'
          icon='🗺️'
          title='云游中国地图'
          description='从全国地图出发，点进省份看看熟悉的地方。'
          onClick={() =>
            Taro.navigateTo({ url: '/packageMap/pages/map/index' })
          }
        />
        <PrimaryButton
          icon='🏯'
          title='浏览寺庙'
          description='直接查看寺庙列表与简介，快速进入内容。'
          variant='secondary'
          onClick={() => Taro.navigateTo({ url: '/pages/temples/list/index' })}
        />
        <PrimaryButton
          icon='🪔'
          title='免费香火'
          description='轻量体验页，先保留一份简单的心意。'
          variant='secondary'
          onClick={() => Taro.navigateTo({ url: '/pages/incense/index/index' })}
        />
      </View>

      <View className='mt-7 rounded-[28rpx] bg-[rgba(255,255,255,0.76)] px-5 py-4 border border-[rgba(226,232,240,0.9)]'>
        <Text className='block text-[24rpx] font-medium text-[#334155]'>
          当前版本说明
        </Text>
        <Text className='block mt-2 text-[22rpx] leading-[1.6] text-[#64748b]'>
          这是 P0 演示版，优先把浏览体验与前后端链路打通，页面会继续细化。
        </Text>
      </View>
    </PageContainer>
  )
}
