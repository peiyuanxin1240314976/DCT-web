import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import { useState } from 'react'

import { fetchTemples } from '@/api/temple'
import { PageContainer } from '@/components'
import { Skeleton } from '@/components/Skeleton/Skeleton'

import type { Temple } from '@/api/types'

export default function TempleList() {
  const [items, setItems] = useState<Temple[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useLoad(() => {
    void (async () => {
      try {
        setLoading(true)
        const res = await fetchTemples()
        if (!res.success || !res.data) {
          throw new Error(res.message || res.code)
        }
        setItems(res.data.items)
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败')
        void Taro.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        setLoading(false)
      }
    })()
  })

  return (
    <PageContainer className='min-h-screen px-6 py-6 bg-white'>
      {error ? <Text className='block mb-4 text-[26rpx] text-[#d4380d]'>{error}</Text> : null}
      {loading ? (
        <View className='flex flex-col gap-4'>
          <Skeleton className='h-[132rpx]' />
          <Skeleton className='h-[132rpx]' />
          <Skeleton className='h-[132rpx]' />
        </View>
      ) : (
        items.map((t) => (
          <View
            key={t.id}
            className='p-6 mb-5 rounded-2xl bg-[#f7f8fa] active:opacity-90'
            onClick={() =>
              Taro.navigateTo({ url: `/pages/temples/detail/index?id=${t.id}` })
            }
          >
            <Text className='block text-[32rpx] font-semibold mb-2 text-text'>{t.name}</Text>
            <Text className='block text-[24rpx] text-muted mb-2'>
              {t.province} {t.city}
            </Text>
            {t.summary ? <Text className='block text-[26rpx] text-[#334155]'>{t.summary}</Text> : null}
          </View>
        ))
      )}
    </PageContainer>
  )
}
