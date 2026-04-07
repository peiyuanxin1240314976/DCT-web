# temple-miniapp

Taro 4 + React 18 + TypeScript（Webpack5）。支持微信小程序与 H5 脚本。

## 安装与开发

```bash
npm install
npm run dev:weapp
# 或
npm run dev:h5
```

将微信开发者工具指向 `dist` 目录（见 `project.config.json` 的 `miniprogramRoot`）。

## 约定

- 与后端共用的响应类型见 `src/api/types.ts`（对齐 `ApiResponse`）。
- 可复用组件放在 `src/components/`，Cursor 规则见 `.cursor/rules/`。

## 配置说明

- `app.config.ts` / 页面 `index.config.ts` 使用**纯对象导出**，勿在配置文件中 `import '@tarojs/taro'` 全量运行时，以免构建期执行失败。
