import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import { useMemo, useState } from 'react'

import { GeoCanvasMap, PageContainer } from '@/components'
import { fetchProvinceGeoJson } from '@/packageProvince/utils/loadGeoJson'

export default function MapProvincePage() {
  const [title, setTitle] = useState('')
  const [geoJson, setGeoJson] = useState<unknown>(null)
  const [err, setErr] = useState<string | null>(null)

  useLoad((q) => {
    void (async () => {
      const adcode = typeof q.adcode === 'string' ? q.adcode : ''
      const name = typeof q.name === 'string' ? decodeURIComponent(q.name) : '本省'
      setTitle(name)
      if (!adcode) {
        setErr('缺少区域参数')
        return
      }

      try {
        const geo = await fetchProvinceGeoJson(adcode)
        setGeoJson(geo)
        setErr(null)
      } catch (e) {
        setErr(e instanceof Error ? e.message : '加载失败')
      }
    })()
  })

  const chartHeight = useMemo(() => Taro.pxTransform(480), [])

  return (
    <PageContainer className='min-h-screen px-6 pt-6 pb-12 bg-[linear-gradient(180deg,#f7fee7_0%,#fff_40%)]'>
      <Text className='block text-[38rpx] font-bold text-[#14532d] mb-2 animate__animated animate__fadeInUp'>
        {title}
      </Text>
      <Text className='block text-[24rpx] text-[#4d7c0f] mb-4 animate__animated animate__fadeInUp animate__delay-1s'>
        先看看这片土地的轮廓，轻松逛一圈就好。
      </Text>
      {err ? (
        <Text className='block text-[26rpx] text-brand mb-3'>{err}</Text>
      ) : null}
      <View className='mb-6 rounded-2xl overflow-hidden bg-white shadow-soft'>
        {geoJson ? (
          <GeoCanvasMap
            geoJson={geoJson}
            height={chartHeight}
            emptyText='正在整理省区地图…'
            fillColor='#ecfccb'
            strokeColor='#84cc16'
            activeFillColor='#bef264'
          />
        ) : (
          <View
            className='flex items-center justify-center'
            style={{ width: '100%', height: chartHeight, minHeight: chartHeight }}
          >
            <Text className='text-[26rpx] text-muted'>正在整理省区地图…</Text>
          </View>
        )}
      </View>
      <View className='p-6 rounded-2xl bg-[#fff7ed] border border-[#fed7aa] animate__animated animate__fadeInUp animate__delay-2s'>
        <Text className='block text-[30rpx] font-semibold mb-3 text-[#9a3412]'>
          ✨ 轻松一刻
        </Text>
        <Text className='block text-[28rpx] leading-[1.55] text-[#7c2d12]'>
          先记住这片土地的轮廓，心愿和香火会慢慢长出来～
        </Text>
      </View>
    </PageContainer>
  )
}
