import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import { useState } from 'react'

import { fetchTemple } from '@/api/temple'
import { PageContainer } from '@/components'

import type { Temple } from '@/api/types'

export default function TempleDetail() {
  const [temple, setTemple] = useState<Temple | null>(null)
  const [error, setError] = useState<string | null>(null)

  useLoad((query) => {
    void (async () => {
      const raw = query.id
      const num = raw ? Number(raw) : NaN
      if (!Number.isFinite(num)) {
        setError('缺少寺庙 id')
        return
      }
      try {
        const res = await fetchTemple(num)
        if (!res.success) {
          throw new Error(res.message || res.code)
        }
        if (!res.data) {
          throw new Error('无数据')
        }
        setTemple(res.data)
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败')
        void Taro.showToast({ title: '加载失败', icon: 'none' })
      }
    })()
  })

  if (error) {
    return (
      <PageContainer className='min-h-screen px-6 py-8 bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_40%,#fffaf5_100%)]'>
        <View className='rounded-[28rpx] border border-[rgba(251,146,60,0.2)] bg-[rgba(255,247,237,0.96)] px-6 py-8'>
          <Text className='block text-[34rpx] font-semibold text-[#9a3412]'>内容加载失败</Text>
          <Text className='block mt-3 text-[26rpx] leading-[1.6] text-[#7c2d12]'>{error}</Text>
        </View>
      </PageContainer>
    )
  }

  if (!temple) {
    return (
      <PageContainer className='min-h-screen px-6 py-8 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_42%,#eef6ff_100%)]'>
        <View className='rounded-[28rpx] bg-[rgba(255,255,255,0.94)] px-6 py-10 shadow-soft'>
          <Text className='block text-[30rpx] font-semibold text-text'>正在整理寺庙信息…</Text>
          <Text className='block mt-3 text-[25rpx] leading-[1.6] text-muted'>
            稍等片刻，简介和位置信息马上出现。
          </Text>
        </View>
      </PageContainer>
    )
  }

  return (
    <PageContainer className='min-h-screen px-6 pt-8 pb-12 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_38%,#eef6ff_100%)]'>
      <View className='rounded-[32rpx] bg-[rgba(255,255,255,0.95)] px-5 py-6 shadow-soft border border-[rgba(191,219,254,0.4)] animate__animated animate__fadeInUp'>
        <View className='mb-4 inline-flex rounded-full bg-[rgba(14,165,233,0.1)] px-4 py-2'>
          <Text className='text-[22rpx] font-medium text-[#0369a1]'>寺庙详情</Text>
        </View>
        <Text className='block text-[44rpx] font-bold text-text'>{temple.name}</Text>
        <Text className='block mt-3 text-[26rpx] text-muted'>
          {temple.province} {temple.city}
        </Text>
        <View className='mt-5 rounded-[24rpx] bg-[#f8fafc] px-4 py-4'>
          <Text className='block text-[23rpx] text-[#64748b]'>当前阅读内容</Text>
          <Text className='block mt-2 text-[27rpx] leading-[1.7] text-[#334155]'>
            {temple.summary || '当前暂未补充更完整的介绍，后续会继续补齐寺庙背景与特色信息。'}
          </Text>
        </View>
      </View>

      <View className='mt-5 rounded-[28rpx] bg-[rgba(255,255,255,0.92)] px-5 py-5 shadow-soft animate__animated animate__fadeInUp animate__delay-1s'>
        <Text className='block text-[30rpx] font-semibold text-[#0f172a]'>适合怎么逛</Text>
        <Text className='block mt-3 text-[25rpx] leading-[1.7] text-[#475569]'>
          可以先把这里当作一张轻量名片，记住地点和一句印象；如果后续接入更多内容，再补充历史、看点与相关寺庙推荐。
        </Text>
      </View>

      <View className='mt-5 rounded-[28rpx] bg-[linear-gradient(135deg,#ecfeff_0%,#eff6ff_100%)] px-5 py-5 border border-[rgba(125,211,252,0.35)] animate__animated animate__fadeInUp animate__delay-2s'>
        <Text className='block text-[28rpx] font-semibold text-[#0f172a]'>当前状态</Text>
        <Text className='block mt-2 text-[24rpx] leading-[1.6] text-[#475569]'>
          P0 阶段先保证列表与详情可浏览，后续再逐步丰富图片、背景故事与地图联动。
        </Text>
      </View>
    </PageContainer>
  )
}
