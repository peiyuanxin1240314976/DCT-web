import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Echarts from 'taro-react-echarts'
import type { EChartOption, ECharts } from 'taro-react-echarts'

import { echarts } from '@/lib/echartsMap'
import { registerMap } from 'echarts/core'
import { fetchChinaGeoJson } from '@/utils/loadGeoJson'

export type ChinaMapViewProps = {
  onProvinceClick?: (name: string) => void
  className?: string
}

export function ChinaMapView({ onProvinceClick, className }: ChinaMapViewProps) {
  const [option, setOption] = useState<EChartOption>({})
  const [error, setError] = useState<string | null>(null)
  const chartRef = useRef<ECharts | null>(null)
  const mapReady = useRef(false)
  const clickRef = useRef(onProvinceClick)
  clickRef.current = onProvinceClick

  const bindClick = useCallback((chart: ECharts) => {
    chart.off('click')
    chart.on('click', (params: { name?: string }) => {
      if (params.name) {
        clickRef.current?.(params.name)
      }
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const geo = await fetchChinaGeoJson()
        if (cancelled) {
          return
        }
        if (!mapReady.current) {
          registerMap('china', geo as Parameters<typeof registerMap>[1])
          mapReady.current = true
        }
        setOption({
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            show: true,
            confine: true
          },
          series: [
            {
              type: 'map',
              map: 'china',
              roam: true,
              scaleLimit: { min: 0.65, max: 4 },
              zoom: 1.05,
              label: {
                show: true,
                color: '#334155',
                fontSize: 10
              },
              itemStyle: {
                areaColor: '#e0f7fa',
                borderColor: '#22d3ee',
                borderWidth: 1
              },
              emphasis: {
                label: { color: '#0f172a' },
                itemStyle: { areaColor: '#a5f3fc' }
              },
              data: []
            }
          ]
        })
        setError(null)
      } catch (e) {
        if (!cancelled) {
          const raw = e instanceof Error ? e.message : ''
          const message = /timeout|network|fail|HTTP 4\d\d|HTTP 5\d\d/i.test(raw)
            ? '地图加载失败：请检查网络，或在开发者工具勾选“不校验合法域名”'
            : raw || '地图加载失败'
          setError(message)
          void Taro.showToast({ title: '地图加载失败', icon: 'none' })
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    const series = (option as { series?: unknown })?.series
    if (!chart || !series) {
      return
    }
    bindClick(chart)
  }, [option, bindClick])

  const onChartReady = useCallback(
    (chart: ECharts) => {
      chartRef.current = chart
      const series = (option as { series?: unknown })?.series
      if (series) {
        bindClick(chart)
      }
    },
    [option, bindClick]
  )

  const opts = useMemo(
    () => ({ devicePixelRatio: Taro.getSystemInfoSync().pixelRatio }),
    []
  )
  const chartHeight = useMemo(() => Taro.pxTransform(520), [])

  const hasSeries = Boolean((option as { series?: unknown })?.series)

  return (
    <View className={['relative w-full', className ?? ''].join(' ')}>
      {error ? (
        <Text className='block px-6 py-4 text-[26rpx] text-[#be123c]'>
          {error}
        </Text>
      ) : null}
      <Echarts
        echarts={echarts}
        option={option}
        style={{ width: '100%', height: chartHeight, minHeight: chartHeight }}
        opts={opts}
        isPage={false}
        onChartReady={onChartReady}
        notMerge
      />
      {!hasSeries && !error ? (
        <Text className='pointer-events-none absolute left-6 bottom-4 z-10 text-[22rpx] text-muted'>
          正在唤醒地图…
        </Text>
      ) : (
        <Text className='pointer-events-none absolute left-6 bottom-4 z-10 text-[22rpx] text-muted'>
          双指缩放 · 点省区下钻
        </Text>
      )}
    </View>
  )
}
