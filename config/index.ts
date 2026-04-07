import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import path from 'node:path'
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack'
import devConfig from './dev'
import prodConfig from './prod'

function applySharedWebpackChain(
  chain: { merge: (arg: unknown) => void; resolve: { plugin: (name: string) => { use: (plugin: unknown) => void } } },
  rem2rpx: boolean
) {
  chain.merge({
    plugin: {
      weappTailwindcss: {
        plugin: UnifiedWebpackPluginV5,
        args: [
          {
            rem2rpx,
            cssEntries: [path.resolve(__dirname, '../src/app.css')]
          }
        ]
      }
    },
    // Filter known noisy warnings from upstream plugin/loader dependency tracking.
    // Keep other warnings untouched.
    ignoreWarnings: [
      {
        message: /Invalid dependencies have been reported by plugins or loaders/
      },
      {
        message: /All reported dependencies need to be absolute paths/
      }
    ]
  })
  chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
}

export default defineConfig<'webpack5'>(async (merge) => {
  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: 'temple-miniapp',
    date: '2026-4-7',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ['@tarojs/plugin-generator'],
    defineConstants: {
      __API_BASE__: JSON.stringify(process.env.TARO_APP_API_BASE ?? 'http://127.0.0.1:8080')
    },
    copy: {
      patterns: [],
      options: {}
    },
    framework: 'react',
    compiler: 'webpack5',
    cache: {
      enable: false
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      webpackChain(chain) {
        applySharedWebpackChain(chain, true)
      }
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js'
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      webpackChain(chain) {
        applySharedWebpackChain(chain, false)
      }
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false
        }
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, devConfig)
  }
  return merge({}, baseConfig, prodConfig)
})
