import { Canvas, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useMemo, useRef, useState } from 'react'

type Point = { x: number; y: number }

type PolygonGeometry = {
  type: 'Polygon'
  coordinates: number[][][]
}

type MultiPolygonGeometry = {
  type: 'MultiPolygon'
  coordinates: number[][][][]
}

type Geometry = PolygonGeometry | MultiPolygonGeometry

type FeatureProperties = {
  name?: string
  fullname?: string
}

type Feature = {
  properties?: FeatureProperties
  geometry?: Geometry | null
}

type FeatureCollection = {
  type: 'FeatureCollection'
  features?: Feature[]
}

type ScreenPolygon = {
  outer: Point[]
  holes: Point[][]
}

type ScreenFeature = {
  name: string
  polygons: ScreenPolygon[]
}

export type GeoCanvasMapProps = {
  geoJson: unknown
  height: string
  emptyText?: string
  fillColor?: string
  strokeColor?: string
  activeFillColor?: string
  onFeatureTap?: (featureName: string) => void
}

export function GeoCanvasMap({
  geoJson,
  height,
  emptyText = '地图准备中…',
  fillColor = '#e0f2fe',
  strokeColor = '#38bdf8',
  activeFillColor = '#7dd3fc',
  onFeatureTap
}: GeoCanvasMapProps) {
  const canvasId = useMemo(
    () => `geo-canvas-${Math.random().toString(36).slice(2, 10)}`,
    []
  )
  const wrapperId = `${canvasId}-wrapper`
  const rectRef = useRef<{ left: number; top: number } | null>(null)
  const shapesRef = useRef<ScreenFeature[]>([])
  const [ready, setReady] = useState(false)
  const [activeName, setActiveName] = useState<string | null>(null)

  useEffect(() => {
    void prepareAndDraw()
  }, [geoJson, activeName])

  const prepareAndDraw = async () => {
    const collection = normalizeFeatureCollection(geoJson)
    if (!collection.features.length) {
      setReady(false)
      return
    }

    await waitForRenderTick()
    const canvasInfo = await queryCanvas(canvasId)
    const wrapperRect = await queryRect(wrapperId)
    if (!canvasInfo?.node || !canvasInfo.width || !canvasInfo.height) {
      setReady(false)
      return
    }

    rectRef.current = wrapperRect
    const dpr = getDevicePixelRatio()
    const canvas = canvasInfo.node as {
      width: number
      height: number
      getContext: (type: '2d') => CanvasRenderingContext2D
    }
    const ctx = canvas.getContext('2d')
    canvas.width = canvasInfo.width * dpr
    canvas.height = canvasInfo.height * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, canvasInfo.width, canvasInfo.height)

    const projected = projectFeatures(collection.features, canvasInfo.width, canvasInfo.height)
    drawFeatures(ctx, projected, canvasInfo.width, canvasInfo.height, {
      fillColor,
      strokeColor,
      activeFillColor,
      activeName
    })

    shapesRef.current = projected
    setReady(true)
  }

  const handleTap = (event: {
    detail?: { x?: number; y?: number }
    changedTouches?: Array<{ pageX?: number; pageY?: number; x?: number; y?: number }>
  }) => {
    const point = resolveTapPoint(event, rectRef.current)
    if (!point) {
      return
    }

    const target = findFeatureByPoint(shapesRef.current, point)
    if (!target) {
      return
    }

    setActiveName(target.name)
    onFeatureTap?.(target.name)
  }

  return (
    <View
      id={wrapperId}
      className='relative w-full overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#f8fdff_0%,#ffffff_100%)]'
      style={{ height }}
    >
      <Canvas
        id={canvasId}
        type='2d'
        className='block w-full h-full'
        onTouchEnd={handleTap}
      />
      {!ready ? (
        <View className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <Text className='text-[26rpx] text-muted'>{emptyText}</Text>
        </View>
      ) : null}
    </View>
  )
}

function normalizeFeatureCollection(input: unknown): FeatureCollection {
  if (
    input &&
    typeof input === 'object' &&
    (input as FeatureCollection).type === 'FeatureCollection' &&
    Array.isArray((input as FeatureCollection).features)
  ) {
    return input as FeatureCollection
  }

  return { type: 'FeatureCollection', features: [] }
}

function getDevicePixelRatio(): number {
  const maybeGetWindowInfo = (
    Taro as typeof Taro & {
      getWindowInfo?: () => { pixelRatio?: number }
    }
  ).getWindowInfo

  if (typeof maybeGetWindowInfo === 'function') {
    try {
      const ratio = maybeGetWindowInfo().pixelRatio
      if (ratio && Number.isFinite(ratio) && ratio > 0) {
        return ratio
      }
    } catch {
      // fall through to legacy API
    }
  }

  return Taro.getSystemInfoSync().pixelRatio || 1
}

async function waitForRenderTick(): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 0)
  })
}

async function queryCanvas(canvasId: string): Promise<
  | {
      node?: object
      width?: number
      height?: number
    }
  | undefined
> {
  return await new Promise((resolve) => {
    Taro.createSelectorQuery()
      .select(`#${canvasId}`)
      .fields({ node: true, size: true }, (res) => {
        resolve((res ?? undefined) as { node?: object; width?: number; height?: number } | undefined)
      })
      .exec()
  })
}

async function queryRect(id: string): Promise<{ left: number; top: number } | null> {
  return await new Promise((resolve) => {
    Taro.createSelectorQuery()
      .select(`#${id}`)
      .boundingClientRect((rect) => {
        if (!rect) {
          resolve(null)
          return
        }
        resolve({
          left: rect.left,
          top: rect.top
        })
      })
      .exec()
  })
}

function projectFeatures(features: Feature[], width: number, height: number): ScreenFeature[] {
  const bounds = computeBounds(features)
  if (!bounds) {
    return []
  }

  const padding = Math.max(16, Math.min(width, height) * 0.06)
  const spanX = Math.max(bounds.maxX - bounds.minX, 1e-6)
  const spanY = Math.max(bounds.maxY - bounds.minY, 1e-6)
  const scale = Math.min((width - padding * 2) / spanX, (height - padding * 2) / spanY)
  const offsetX = (width - spanX * scale) / 2
  const offsetY = (height - spanY * scale) / 2

  return features
    .map((feature) => {
      const geometry = feature.geometry
      if (!geometry) {
        return null
      }

      const polygons = extractPolygons(geometry).map((polygon) => ({
        outer: polygon[0].map((coordinate) =>
          projectPoint(coordinate, bounds, scale, offsetX, offsetY, height)
        ),
        holes: polygon.slice(1).map((ring) =>
          ring.map((coordinate) => projectPoint(coordinate, bounds, scale, offsetX, offsetY, height))
        )
      }))

      return {
        name: feature.properties?.name || feature.properties?.fullname || '未知区域',
        polygons
      } satisfies ScreenFeature
    })
    .filter((item): item is ScreenFeature => Boolean(item && item.polygons.length))
}

function computeBounds(features: Feature[]) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const feature of features) {
    const geometry = feature.geometry
    if (!geometry) {
      continue
    }
    const polygons = extractPolygons(geometry)
    for (const polygon of polygons) {
      for (const ring of polygon) {
        for (const [x, y] of ring) {
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
      }
    }
  }

  if (![minX, minY, maxX, maxY].every(Number.isFinite)) {
    return null
  }

  return { minX, minY, maxX, maxY }
}

function extractPolygons(geometry: Geometry): number[][][][] {
  if (geometry.type === 'Polygon') {
    return [geometry.coordinates]
  }
  return geometry.coordinates
}

function projectPoint(
  coordinate: number[],
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
  scale: number,
  offsetX: number,
  offsetY: number,
  height: number
): Point {
  return {
    x: offsetX + (coordinate[0] - bounds.minX) * scale,
    y: height - (offsetY + (coordinate[1] - bounds.minY) * scale)
  }
}

function drawFeatures(
  ctx: CanvasRenderingContext2D,
  features: ScreenFeature[],
  width: number,
  height: number,
  colors: {
    fillColor: string
    strokeColor: string
    activeFillColor: string
    activeName: string | null
  }
) {
  ctx.save()
  ctx.clearRect(0, 0, width, height)
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  for (const feature of features) {
    ctx.beginPath()
    for (const polygon of feature.polygons) {
      drawRing(ctx, polygon.outer)
      for (const hole of polygon.holes) {
        drawRing(ctx, hole)
      }
    }
    ctx.fillStyle = feature.name === colors.activeName ? colors.activeFillColor : colors.fillColor
    ctx.strokeStyle = colors.strokeColor
    ctx.lineWidth = 1
    ctx.fill('evenodd')
    ctx.stroke()
  }

  ctx.restore()
}

function drawRing(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (!points.length) {
    return
  }
  ctx.moveTo(points[0].x, points[0].y)
  for (let index = 1; index < points.length; index += 1) {
    ctx.lineTo(points[index].x, points[index].y)
  }
  ctx.closePath()
}

function resolveTapPoint(
  event: {
    detail?: { x?: number; y?: number }
    changedTouches?: Array<{ pageX?: number; pageY?: number; x?: number; y?: number }>
  },
  rect: { left: number; top: number } | null
): Point | null {
  if (typeof event.detail?.x === 'number' && typeof event.detail?.y === 'number') {
    return { x: event.detail.x, y: event.detail.y }
  }

  const touch = event.changedTouches?.[0]
  if (!touch) {
    return null
  }

  if (typeof touch.x === 'number' && typeof touch.y === 'number') {
    return { x: touch.x, y: touch.y }
  }

  if (rect && typeof touch.pageX === 'number' && typeof touch.pageY === 'number') {
    return {
      x: touch.pageX - rect.left,
      y: touch.pageY - rect.top
    }
  }

  return null
}

function findFeatureByPoint(features: ScreenFeature[], point: Point): ScreenFeature | null {
  for (const feature of features) {
    for (const polygon of feature.polygons) {
      if (!pointInRing(point, polygon.outer)) {
        continue
      }
      const isInsideHole = polygon.holes.some((hole) => pointInRing(point, hole))
      if (!isInsideHole) {
        return feature
      }
    }
  }

  return null
}

function pointInRing(point: Point, ring: Point[]): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const xi = ring[i].x
    const yi = ring[i].y
    const xj = ring[j].x
    const yj = ring[j].y
    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / ((yj - yi) || Number.EPSILON) + xi
    if (intersect) {
      inside = !inside
    }
  }
  return inside
}
