const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware') // 热更新
const chokidar = require('chokidar')

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
      callback(template,serverBundle, clientManifest)
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
}