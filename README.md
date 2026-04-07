# temple-miniapp

Taro 4 + React 18 + TypeScript（Webpack5）。支持微信小程序与 H5 脚本。

## 设计流程（与后端共用）

若工作区包含上级目录 `docs/`，请先阅读：

- `docs/DESIGN_PROCESS.md` — 设计—开发流程（必须遵守）
- `docs/P0_PLAN.md` — P0 范围与验收
- `docs/API_P0.md` — 接口基线

## 安装与开发

```bash
npm install
npm run dev:weapp
# 或
npm run dev:h5
```

将微信开发者工具指向 `dist` 目录（见 `project.config.json` 的 `miniprogramRoot`）。

## API 地址

开发环境在 `.env.development` 中配置 `TARO_APP_API_BASE`（默认 `http://127.0.0.1:8080`）。真机调试请改为电脑局域网 IP，并在开发者工具中开启「不校验合法域名」。

## 地图与动画

- **中国地图**：分包 `packageMap`（`云游中国` → 省区下钻），GeoJSON 来自 `geo.datav.aliyun.com`，正式版请在微信公众平台配置 **request 合法域名**：`https://geo.datav.aliyun.com`。
- **动画**：全局 `src/styles/motion.css`（以 `transform`/`opacity` 为主）；首页轮播用 `Swiper`；图表用 **ECharts 按需引入**（`src/lib/echartsMap.ts`），避免 `import 'echarts'` 全量。
- **性能**：地图与 ECharts 放在分包，减轻首屏；勿在列表里同时跑多个 Canvas 动画。

## 约定

- 与后端共用的响应类型见 `src/api/types.ts`（对齐 `ApiResponse`）。
- 可复用组件放在 `src/components/`，Cursor 规则见 `.cursor/rules/`。

## 配置说明

- `app.config.ts` / 页面 `index.config.ts` 使用**纯对象导出**，勿在配置文件中 `import '@tarojs/taro'` 全量运行时，以免构建期执行失败。
