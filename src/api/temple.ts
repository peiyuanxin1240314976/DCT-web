import { apiGet } from './http'

import type { Temple, TempleListData } from './types'

export function fetchTemples() {
  return apiGet<TempleListData>('/api/v1/temples')
}

export function fetchTemple(id: number) {
  return apiGet<Temple>(`/api/v1/temples/${id}`)
}
