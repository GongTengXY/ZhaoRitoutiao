const { defineConfig } = require('@vue/cli-service')
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = '朝日头条'

let cdn = { css : [], js : []}
const isProd = process.env.NODE_ENV === 'production' // 判断是否为生产环境
let externals = {}
if (isProd) {
  // webpack打包排除的包
  externals = {
    'vue': 'Vue',
    'vant': 'vant',
  }

  cdn = {
    css : [
      'https://cdn.jsdelivr.net/npm/vant@2.12.47/lib/index.css'
    ],
    js : [
      'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vant@2.12.47/lib/vant.min.js',
    ]
  }
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: process.env.NODE_ENV === 'development',
  devServer: {
    open: true
  },
  publicPath : '/',    // 打包时，让webpack把路径改成相对路径
  configureWebpack : {
    name: name,
    // resolve: {
    //   alias: {
    //     '@': resolve('src')
    //   }
    // },
    externals
  },
  chainWebpack(config) {
    config.plugin('html').tap((args) => {
      args[0].cdn = cdn
      return args
    })

    config.resolve.alias.set("@", resolve("src"))
  }
})
