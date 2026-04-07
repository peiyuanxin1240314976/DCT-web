/**
 * Mirrors backend `com.temple.api.common.api.ApiResponse` JSON shape (camelCase fields).
 */
export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string | null
  data: T | null
}
