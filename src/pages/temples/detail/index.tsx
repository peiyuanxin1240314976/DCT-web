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

  useLoad(async (query) => {
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
  })

  if (error) {
    return (
      <PageContainer className='temple-detail'>
        <Text className='block px-6 py-6 text-[28rpx] text-[#d4380d]'>{error}</Text>
      </PageContainer>
    )
  }

  if (!temple) {
    return (
      <PageContainer className='min-h-screen px-6 py-6 bg-white'>
        <Text className='block text-[28rpx] text-muted'>加载中…</Text>
      </PageContainer>
    )
  }

  return (
    <PageContainer className='min-h-screen px-6 py-6 bg-white'>
      <Text className='block text-[40rpx] font-bold text-text mb-4 animate__animated animate__fadeInUp'>
        {temple.name}
      </Text>
      <Text className='block text-[26rpx] text-muted mb-6 animate__animated animate__fadeInUp animate__delay-1s'>
        {temple.province} {temple.city}
      </Text>
      {temple.summary ? (
        <Text className='block text-[28rpx] leading-[1.6] text-[#334155] animate__animated animate__fadeInUp animate__delay-2s'>
          {temple.summary}
        </Text>
      ) : (
        <Text className='block text-[28rpx] leading-[1.6] text-[#334155]'>暂无简介</Text>
      )}
    </PageContainer>
  )
}
