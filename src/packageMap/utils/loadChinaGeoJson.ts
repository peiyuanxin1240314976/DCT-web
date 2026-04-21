import chinaGeoJson from '../data/map/china.json'

export async function fetchChinaGeoJson(): Promise<unknown> {
  return unwrapJsonModule(chinaGeoJson)
}

function unwrapJsonModule(input: unknown): unknown {
  if (input && typeof input === 'object' && 'default' in (input as Record<string, unknown>)) {
    return (input as { default: unknown }).default
  }

  return input
}
