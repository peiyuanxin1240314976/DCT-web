const provinceGeoJsonLoaders: Record<string, () => Promise<unknown>> = {
  '110000': () => import('../data/map/province/110000.json'),
  '120000': () => import('../data/map/province/120000.json'),
  '130000': () => import('../data/map/province/130000.json'),
  '140000': () => import('../data/map/province/140000.json'),
  '150000': () => import('../data/map/province/150000.json'),
  '210000': () => import('../data/map/province/210000.json'),
  '220000': () => import('../data/map/province/220000.json'),
  '230000': () => import('../data/map/province/230000.json'),
  '310000': () => import('../data/map/province/310000.json'),
  '320000': () => import('../data/map/province/320000.json'),
  '330000': () => import('../data/map/province/330000.json'),
  '340000': () => import('../data/map/province/340000.json'),
  '350000': () => import('../data/map/province/350000.json'),
  '360000': () => import('../data/map/province/360000.json'),
  '370000': () => import('../data/map/province/370000.json'),
  '410000': () => import('../data/map/province/410000.json'),
  '420000': () => import('../data/map/province/420000.json'),
  '430000': () => import('../data/map/province/430000.json'),
  '440000': () => import('../data/map/province/440000.json'),
  '450000': () => import('../data/map/province/450000.json'),
  '460000': () => import('../data/map/province/460000.json'),
  '500000': () => import('../data/map/province/500000.json'),
  '510000': () => import('../data/map/province/510000.json'),
  '520000': () => import('../data/map/province/520000.json'),
  '530000': () => import('../data/map/province/530000.json'),
  '540000': () => import('../data/map/province/540000.json'),
  '610000': () => import('../data/map/province/610000.json'),
  '620000': () => import('../data/map/province/620000.json'),
  '630000': () => import('../data/map/province/630000.json'),
  '640000': () => import('../data/map/province/640000.json'),
  '650000': () => import('../data/map/province/650000.json'),
  '710000': () => import('../data/map/province/710000.json'),
  '810000': () => import('../data/map/province/810000.json'),
  '820000': () => import('../data/map/province/820000.json')
}

export async function fetchProvinceGeoJson(adcode: string): Promise<unknown> {
  const loader = provinceGeoJsonLoaders[adcode]
  if (!loader) {
    throw new Error(`未找到区域边界：${adcode}`)
  }

  return unwrapJsonModule(await loader())
}

function unwrapJsonModule(input: unknown): unknown {
  if (input && typeof input === 'object' && 'default' in (input as Record<string, unknown>)) {
    return (input as { default: unknown }).default
  }

  return input
}
