const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware') // 热更新
const chokidar = require('chokidar')
const resolve = file => path.resolve(__dirname,file)
module.exports = (server, callback) => {
  let ready
  const onReady =  new Promise(r => ready = r)
  // 监视构图 -> 更新renderer
  let template
  let serverBundle
  let clientManifest

  const update = () => {
    if (template && serverBundle && clientManifest) {
      ready()
      callback(serverBundle,template, clientManifest)
    }
  }
  // 监视构建template的变化 重新读取 -> 调用update 更新renderer
  const templatePath = path.resolve(__dirname, '../index.template.html')
  template = fs.readFileSync(templatePath, 'utf-8')
  chokidar.watch(templatePath).on('change',()=> {
    template = fs.readFileSync(templatePath, 'utf-8')
    update()
  })

  // 监视构建serverBundle 调用update 更新renderer
  const serverConfig = require('./webpack.server.config')
  const serverCompiler = webpack(serverConfig)
  const serverDevMiddleware = devMiddleware(serverCompiler, {
    logLevel: 'silent'
  })
  serverCompiler.hooks.done.tap('server', ()=> {
    serverBundle = JSON.parse(serverDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'),'utf-8'))
    update()
  })


    // 监视构建clientManifest 调用update 更新renderer
  const clientConfig = require('./webpack.client.config')
  // 热更新
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  clientConfig.entry.app = [
    // 和服务端交互处理热更新一个客户端脚本
    'webpack-hot-middleware/client?quiet=true&reload=true', 
    clientConfig.entry.app
  ]
  clientConfig.output.filename = '[name].js'
  const clientCompiler = webpack(clientConfig)
  const clientDevMiddleware = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'silent'
  })
  clientCompiler.hooks.done.tap('client', ()=> {
    clientManifest = JSON.parse(clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'),'utf-8'))
    update()
  })

  server.use(hotMiddleware(clientCompiler, {
    log: false // 关闭它本身的日志输出
  }))

  // 重要 将clientDevMiddleware 挂载到express服务中
  server.use(clientDevMiddleware)
  return onReady
}