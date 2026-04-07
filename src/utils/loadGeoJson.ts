import Taro from '@tarojs/taro'

const LOCAL_MAP_BASE = resolveLocalMapBase()

/** 全国省级边界 */
export async function fetchChinaGeoJson(): Promise<unknown> {
  // 开发态只走本地后端静态资源，避免外网证书/域名问题。
  return fetchJson(`${LOCAL_MAP_BASE}/china.json`, 12000)
}

/** 省级下钻边界 */
export async function fetchProvinceGeoJson(adcode: string): Promise<unknown> {
  return fetchJson(`${LOCAL_MAP_BASE}/province/${adcode}.json`, 12000)
}

async function fetchJson(url: string, timeout: number): Promise<unknown> {
  const res = await Taro.request<unknown>({ url, method: 'GET', timeout })
  if (typeof res.statusCode === 'number' && (res.statusCode < 200 || res.statusCode >= 300)) {
    throw new Error(`HTTP ${res.statusCode}`)
  }
  return res.data
}

function resolveLocalMapBase(): string {
  const apiBase = __API_BASE__.replace(/\/+$/, '')
  const match = apiBase.match(/^(https?:\/\/[^/]+)/)
  const origin = match?.[1] ?? apiBase
  return `${origin}/map`
}
