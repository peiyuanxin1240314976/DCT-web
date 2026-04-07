import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import Echarts from 'taro-react-echarts'
import { useMemo, useState } from 'react'
import type { EChartOption } from 'taro-react-echarts'

import { echarts } from '@/lib/echartsMap'
import { registerMap } from 'echarts/core'
import { fetchProvinceGeoJson } from '@/utils/loadGeoJson'
import { PageContainer } from '@/components'

export default function MapProvincePage() {
  const [title, setTitle] = useState('')
  const [option, setOption] = useState<EChartOption>({})
  const [err, setErr] = useState<string | null>(null)

  useLoad(async (q) => {
    const adcode = typeof q.adcode === 'string' ? q.adcode : ''
    const name = typeof q.name === 'string' ? decodeURIComponent(q.name) : '本省'
    setTitle(name)
    if (!adcode) {
      setErr('缺少区域参数')
      return
    }
    try {
      const geo = await fetchProvinceGeoJson(adcode)
      const mapName = `p_${adcode}`
      registerMap(mapName, geo as Parameters<typeof registerMap>[1])
      setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item', confine: true },
        series: [
          {
            type: 'map',
            map: mapName,
            roam: true,
            scaleLimit: { min: 0.5, max: 5 },
            label: { show: true, fontSize: 9, color: '#334155' },
            itemStyle: {
              areaColor: '#ecfccb',
              borderColor: '#84cc16',
              borderWidth: 0.6
            },
            emphasis: {
              itemStyle: { areaColor: '#d9f99d' }
            }
          }
        ]
      })
      setErr(null)
    } catch (e) {
      setErr(e instanceof Error ? e.message : '加载失败')
    }
  })

  const opts = useMemo(
    () => ({ devicePixelRatio: Taro.getSystemInfoSync().pixelRatio }),
    []
  )
  const chartHeight = useMemo(() => Taro.pxTransform(480), [])

  return (
    <PageContainer className='min-h-screen px-6 pt-6 pb-12 bg-[linear-gradient(180deg,#f7fee7_0%,#fff_40%)]'>
      <Text className='block text-[38rpx] font-bold text-[#14532d] mb-2 animate__animated animate__fadeInUp'>
        {title}
      </Text>
      <Text className='block text-[24rpx] text-[#4d7c0f] mb-4 animate__animated animate__fadeInUp animate__delay-1s'>
        继续缩放看看～ 寺庙列表稍后接上
      </Text>
      {err ? (
        <Text className='block text-[26rpx] text-brand mb-3'>{err}</Text>
      ) : null}
      <View className='mb-6 rounded-2xl overflow-hidden bg-white shadow-soft'>
        <Echarts
          echarts={echarts}
          option={option}
          style={{ width: '100%', height: chartHeight, minHeight: chartHeight }}
          opts={opts}
          isPage={false}
          notMerge
        />
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
