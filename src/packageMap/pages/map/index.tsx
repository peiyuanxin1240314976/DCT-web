import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'

import { ChinaMapView } from '@/components/ChinaMapView'
import { resolveProvinceAdcode } from '@/data/provinceAdcode'
import { PageContainer } from '@/components'
import { MascotBubble } from '@/components'

export default function MapChinaPage() {
  const [drilling, setDrilling] = useState(false)

  return (
    <PageContainer className='min-h-screen px-6 pt-6 pb-12 bg-[linear-gradient(180deg,#f0f9ff_0%,#fff_32%)]'>
      <Text className='block text-[40rpx] font-bold text-text mb-3 animate__animated animate__fadeInUp'>
        随便逛逛地图～
      </Text>
      <Text className='block text-[26rpx] text-muted mb-6 leading-[1.5] animate__animated animate__fadeInUp animate__delay-1s'>
        放大缩小找家乡，点一点进省区看看
      </Text>
      <MascotBubble
        className='mb-5'
        name='小福'
        emoji='🗺️'
        state={drilling ? 'happy' : 'guide'}
        message='点中省份就能下钻咯，我会在省里给你讲几句有趣的小特色～'
      />
      <View
        className={[
          'rounded-2xl overflow-hidden bg-white shadow-soft animate__animated animate__fadeInUp animate__delay-2s',
          drilling ? 'magictime swashOut' : ''
        ].join(' ')}
      >
        <ChinaMapView
          onProvinceClick={(name) => {
            const adcode = resolveProvinceAdcode(name)
            if (!adcode) {
              void Taro.showToast({ title: `${name} 暂未收录`, icon: 'none' })
              return
            }
            // 下钻：先给一个轻反馈，再跳转（避免“点了没反应”的感受）
            try {
              void Taro.vibrateShort({ type: 'light' })
            } catch {
              void Taro.vibrateShort()
            }
            setDrilling(true)
            setTimeout(() => {
              void Taro.navigateTo({
                url: `/packageMap/pages/map/province/index?adcode=${adcode}&name=${encodeURIComponent(name)}`
              })
              setDrilling(false)
            }, 220)
          }}
        />
      </View>
    </PageContainer>
  )
}
