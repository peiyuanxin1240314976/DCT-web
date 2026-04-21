import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import { useMemo, useState } from 'react'

import { resolveProvinceAdcode } from '@/data/provinceAdcode'
import { GeoCanvasMap, MascotBubble, PageContainer } from '@/components'
import { fetchChinaGeoJson } from '@/packageMap/utils/loadChinaGeoJson'

export default function MapChinaPage() {
  const [drilling, setDrilling] = useState(false)
  const [geoJson, setGeoJson] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)

  useLoad(() => {
    void (async () => {
      try {
        const geo = await fetchChinaGeoJson()
        setGeoJson(geo)
        setError(null)
      } catch (e) {
        const raw = e instanceof Error ? e.message : ''
        const message = /timeout|network|fail|HTTP 4\d\d|HTTP 5\d\d/i.test(raw)
          ? '地图加载失败：请检查网络，或在开发者工具勾选“不校验合法域名”'
          : raw || '地图加载失败'
        setError(message)
        void Taro.showToast({ title: '地图加载失败', icon: 'none' })
      }
    })()
  })

  const chartHeight = useMemo(() => Taro.pxTransform(520), [])
  const hasMap = Boolean(geoJson)

  const handleProvinceClick = (name: string) => {
    const adcode = resolveProvinceAdcode(name)
    if (!adcode) {
      void Taro.showToast({ title: `${name} 暂未收录`, icon: 'none' })
      return
    }
    try {
      void Taro.vibrateShort({ type: 'light' })
    } catch {
      void Taro.vibrateShort()
    }
    setDrilling(true)
    setTimeout(() => {
      void Taro.navigateTo({
        url: `/packageProvince/pages/map/province/index?adcode=${adcode}&name=${encodeURIComponent(name)}`
      })
      setDrilling(false)
    }, 220)
  }

  return (
    <PageContainer className='min-h-screen px-6 pt-6 pb-12 bg-[linear-gradient(180deg,#f0f9ff_0%,#fff_32%)]'>
      <Text className='block text-[40rpx] font-bold text-text mb-3 animate__animated animate__fadeInUp'>
        随便逛逛地图～
      </Text>
      <Text className='block text-[26rpx] text-muted mb-6 leading-[1.5] animate__animated animate__fadeInUp animate__delay-1s'>
        轻点省区找家乡，再进去看看熟悉的轮廓
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
        <View className='relative w-full'>
          {error ? (
            <Text className='block px-6 py-4 text-[26rpx] text-[#be123c]'>
              {error}
            </Text>
          ) : null}
          {hasMap ? (
            <GeoCanvasMap
              geoJson={geoJson}
              height={chartHeight}
              emptyText='正在整理中国地图…'
              fillColor='#dff7ff'
              strokeColor='#38bdf8'
              activeFillColor='#7dd3fc'
              onFeatureTap={handleProvinceClick}
            />
          ) : (
            <View
              className='flex items-center justify-center'
              style={{ width: '100%', height: chartHeight, minHeight: chartHeight }}
            >
              <Text className='text-[26rpx] text-muted'>正在整理中国地图…</Text>
            </View>
          )}
          {!hasMap && !error ? (
            <Text className='pointer-events-none absolute left-6 bottom-4 z-10 text-[22rpx] text-muted'>
              正在唤醒地图…
            </Text>
          ) : (
            <Text className='pointer-events-none absolute left-6 bottom-4 z-10 text-[22rpx] text-muted'>
              轻点省区下钻
            </Text>
          )}
        </View>
      </View>
    </PageContainer>
  )
}
