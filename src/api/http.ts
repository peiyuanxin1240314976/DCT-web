import Taro, { ENV_TYPE } from '@tarojs/taro'

import type { ApiResponse } from './types'

const BASE = __API_BASE__

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  if (Taro.getEnv() === ENV_TYPE.WEAPP && /:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/.test(BASE)) {
    throw new Error(
      '小程序环境无法直接访问 localhost。请把 TARO_APP_API_BASE 改成电脑局域网 IP（如 http://192.168.x.x:8080）。'
    )
  }

  const url = `${BASE}${path}`
  const res = await Taro.request<ApiResponse<T>>({
    url,
    method: 'GET',
    timeout: 10000
  })
  return res.data
}
