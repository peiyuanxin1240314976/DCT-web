/**
 * Mirrors backend `com.temple.api.common.api.ApiResponse` JSON shape (camelCase fields).
 */
export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string | null
  data: T | null
}

export interface Temple {
  id: number
  name: string
  province: string
  city: string
  summary: string | null
  coverImageUrl: string | null
}

export interface TempleListData {
  items: Temple[]
}
