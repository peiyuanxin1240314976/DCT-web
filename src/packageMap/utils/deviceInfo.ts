import Taro from '@tarojs/taro'

export function getDevicePixelRatio(): number {
  const dprFromWindow = tryGetWindowPixelRatio()
  if (typeof dprFromWindow === 'number' && Number.isFinite(dprFromWindow) && dprFromWindow > 0) {
    return dprFromWindow
  }

  const legacy = Taro.getSystemInfoSync()
  return legacy.pixelRatio || 1
}

function tryGetWindowPixelRatio(): number | undefined {
  const maybeGetWindowInfo = (
    Taro as typeof Taro & {
      getWindowInfo?: () => { pixelRatio?: number }
    }
  ).getWindowInfo

  if (typeof maybeGetWindowInfo !== 'function') {
    return undefined
  }

  try {
    return maybeGetWindowInfo().pixelRatio
  } catch {
    return undefined
  }
}
