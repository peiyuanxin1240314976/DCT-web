import Taro from '@tarojs/taro'

export type ThemeName = 'zen' | 'sunrise' | 'youth'

const KEY = 'themeName'

export function getThemeName(): ThemeName {
  const v = Taro.getStorageSync(KEY)
  if (v === 'sunrise' || v === 'zen' || v === 'youth') {
    return v
  }
  return 'youth'
}

export function setThemeName(next: ThemeName) {
  Taro.setStorageSync(KEY, next)
}

