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
    <PageContainer className='min-h-screen px-6 pt-8 pb-12 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_36%,#eef6ff_100%)]'>
      <View className='mb-6 rounded-[30rpx] bg-[rgba(255,255,255,0.94)] px-5 py-6 shadow-soft border border-[rgba(191,219,254,0.45)]'>
        <View className='mb-4 inline-flex rounded-full bg-[rgba(37,99,235,0.08)] px-4 py-2'>
          <Text className='text-[22rpx] font-medium text-[#1d4ed8]'>寺庙内容浏览</Text>
        </View>
        <Text className='block text-[42rpx] font-bold text-text'>找一座想停下来的寺庙</Text>
        <Text className='block mt-3 text-[26rpx] leading-[1.6] text-[#475569]'>
          先看名字、地区和一段简介，想继续了解再进入详情。
        </Text>
        <View className='mt-5 flex flex-row items-center justify-between rounded-[24rpx] bg-[#f8fafc] px-4 py-4'>
          <View>
            <Text className='block text-[22rpx] text-[#64748b]'>当前收录</Text>
            <Text className='block mt-1 text-[34rpx] font-semibold text-[#0f172a]'>
              {loading ? '--' : items.length}
            </Text>
          </View>
          <View className='rounded-full bg-[#ecfeff] px-4 py-2'>
            <Text className='text-[22rpx] text-[#0f766e]'>轻量演示数据</Text>
          </View>
        </View>
      </View>

      {error ? (
        <View className='mb-5 rounded-[24rpx] border border-[rgba(248,113,113,0.25)] bg-[rgba(254,242,242,0.96)] px-5 py-4'>
          <Text className='block text-[26rpx] font-medium text-[#b91c1c]'>加载失败</Text>
          <Text className='block mt-2 text-[24rpx] leading-[1.6] text-[#7f1d1d]'>{error}</Text>
        </View>
      ) : null}

      {loading ? (
        <View className='flex flex-col gap-4'>
          <Skeleton className='h-[220rpx] rounded-[28rpx]' />
          <Skeleton className='h-[220rpx] rounded-[28rpx]' />
          <Skeleton className='h-[220rpx] rounded-[28rpx]' />
        </View>
      ) : items.length === 0 ? (
        <View className='rounded-[28rpx] bg-[rgba(255,255,255,0.92)] px-6 py-10 text-center shadow-soft'>
          <Text className='block text-[32rpx] font-semibold text-[#0f172a]'>暂时还没有内容</Text>
          <Text className='block mt-3 text-[25rpx] leading-[1.6] text-[#64748b]'>
            可以稍后再来看看，或先去地图页随便逛逛。
          </Text>
        </View>
      ) : (
        <View className='flex flex-col gap-4'>
          {items.map((t, index) => (
            <View
              key={t.id}
              className='rounded-[28rpx] bg-[rgba(255,255,255,0.96)] p-5 shadow-soft border border-[rgba(226,232,240,0.9)] active:opacity-90'
              onClick={() =>
                Taro.navigateTo({ url: `/pages/temples/detail/index?id=${t.id}` })
              }
            >
              <View className='mb-4 flex flex-row items-start justify-between gap-3'>
                <View className='flex-1'>
                  <Text className='block text-[34rpx] font-semibold text-text'>{t.name}</Text>
                  <Text className='block mt-2 text-[24rpx] text-muted'>
                    {t.province} {t.city}
                  </Text>
                </View>
                <View className='rounded-full bg-[rgba(14,165,233,0.1)] px-3 py-2'>
                  <Text className='text-[22rpx] text-[#0369a1]'>No.{index + 1}</Text>
                </View>
              </View>
              <Text className='block text-[26rpx] leading-[1.7] text-[#334155]'>
                {t.summary || '当前暂未补充简介，先进入详情页看看后续内容。'}
              </Text>
              <View className='mt-5 flex flex-row items-center justify-between rounded-[22rpx] bg-[#f8fafc] px-4 py-3'>
                <Text className='text-[23rpx] text-[#64748b]'>点开可查看详情内容</Text>
                <Text className='text-[24rpx] font-medium text-[#0284c7]'>进入详情</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </PageContainer>
  )
}
