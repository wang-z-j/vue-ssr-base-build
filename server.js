/**
 * 通用应用web服务启动脚本
*/
const express = require('express')
const server = require('express')()
const Vue = require('vue')
const VueserverRenderer = require('vue-server-renderer')
const fs = require("fs")
server.use('/dist', express.static('./dist'))
const isProd = process.env.NODE_ENV === 'production'
let renderer
let onReady
if (isProd) {
  // 生产环境 直接使用打包文件并生成渲染器
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  const template = fs.readFileSync('./index.template.html','utf-8')
  // 生成一个渲染器
  renderer = VueserverRenderer.createBundleRenderer(serverBundle,{
    template,
    clientManifest
  })
} else {
  // 开发环境
  // 重新打包构建（客户端+服务端） >>> 在生成renderer渲染器
  onReady = setupDevServer(server,(serverBundle,template,clientManifest) {
      renderer = VueserverRenderer.createBundleRenderer(serverBundle,{
      template,
      clientManifest
    })
  })
}
const render = (req,res) => {
  // const app = createApp()
  // 这里无需传入一个应用程序，因为在执行bundle的时候已经自动创建过
  // 现在我们的服务器与应用程序已经解耦
  // bundle renderer 在调用renderToString时候
  // 它将自动执行 由bundle创建的应用程序实例 所导出的函数（传入上下文作为参数） 然后渲染它
  renderer.renderToString({
    title: '小军vue-ssr',
    meta: `<meta name="description" content="hello world">`
  }, (err,html) => {
    if (err) {
      return res.status(500).end('Internal Server Error.')
    }
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  })
}
server.get('/',
 isProd 
  ? render
  : async (req,res) => {
    await onReady
    render(req,res)
  }
)
// 监听端口号
server.listen(3000,()=> {})