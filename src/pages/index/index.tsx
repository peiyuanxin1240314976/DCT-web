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
    <PageContainer className='min-h-screen px-7 pt-8 pb-12 bg-[linear-gradient(165deg,var(--accent-warm)_0%,#fff_38%,var(--accent-cool)_100%)]'>
      <View className='mb-7 animate__animated animate__fadeInUp'>
        <Text className='block mb-4 text-[44rpx] font-bold text-text magictime puffIn'>
          心灵小憩
        </Text>
        <TypingText
          className='block text-[28rpx] leading-[1.55] text-[#475569]'
          text='慢下来，逛逛庙、看看地图，什么都不买也没关系～'
          cps={16}
        />
      </View>

      <MascotBubble
        className='mb-6'
        name='小祈'
        emoji='🌟'
        state='idle'
        message='嘿～今天想先逛地图，还是先点一盏免费的心灯呀？'
      />

      <Swiper
        className='h-[120rpx] mb-9 animate__animated animate__fadeInUp animate__delay-1s'
        autoplay
        circular
        interval={3200}
        vertical={false}
      >
        {TIPS.map((t) => (
          <SwiperItem key={t}>
            <View className='h-[120rpx] px-5 rounded-2xl bg-[rgba(255,255,255,0.88)] shadow-soft border border-[rgba(125,211,252,0.45)] flex items-center justify-center'>
              <Text className='text-[28rpx] text-[#0e7490] text-center'>{t}</Text>
            </View>
          </SwiperItem>
        ))}
      </Swiper>

      <View className='flex flex-col gap-5 animate__animated animate__fadeInUp animate__delay-2s'>
        <PrimaryButton
          className='motion-pulse-scale'
          onClick={() =>
            Taro.navigateTo({ url: '/packageMap/pages/map/index' })
          }
        >
          🗺️ 云游中国地图
        </PrimaryButton>
        <PrimaryButton
          onClick={() => Taro.navigateTo({ url: '/pages/temples/list/index' })}
        >
          浏览寺庙
        </PrimaryButton>
        <PrimaryButton
          onClick={() => Taro.navigateTo({ url: '/pages/incense/index/index' })}
        >
          免费香火
        </PrimaryButton>
      </View>
    </PageContainer>
  )
}
