/**
 * 仅注册地图所需模块，减小包体；勿 import 完整 echarts。
 */
import * as echarts from 'echarts/core'
import { MapChart } from 'echarts/charts'
import {
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  TitleComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  CanvasRenderer,
  MapChart,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  TitleComponent
])

export { echarts }
