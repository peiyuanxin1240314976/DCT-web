import { Text } from '@tarojs/components'
import { useEffect, useMemo, useState } from 'react'

export type TypingTextProps = {
  text: string
  /** characters per second */
  cps?: number
  className?: string
  /** show full text immediately */
  instant?: boolean
}

/**
 * AI 打字效果（轻量版）：仅更新自身 Text，不触发布局动画。
 */
export function TypingText({ text, cps = 18, className, instant }: TypingTextProps) {
  const [n, setN] = useState(instant ? text.length : 0)

  useEffect(() => {
    if (instant) {
      setN(text.length)
      return
    }
    setN(0)
    const interval = Math.max(16, Math.floor(1000 / cps))
    const id = setInterval(() => {
      setN((prev) => (prev >= text.length ? prev : prev + 1))
    }, interval)
    return () => clearInterval(id)
  }, [text, cps, instant])

  const out = useMemo(() => text.slice(0, n), [text, n])

  return <Text className={className}>{out}</Text>
}

