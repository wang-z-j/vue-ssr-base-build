
const Vue = require('vue')
const renderer = require("vue-server-renderer").createRenderer();
const server = require("express")()
const app = new Vue({
  template: `<div>{{msg}}</div>`,
  data: {
    msg: 'hello vue ssr'
  }
})
server.get('/',(req,res) => {
  // 3 将vue实例渲染成html
renderer
  .renderToString(app)
  .then(html => {
    res.end(`
      <!DOCTYPE html> <html lang="en"> <head> <title>Hello</title> <meta charset="UTF-8"> </head> <body>${html}</body> </html>
    `)
  })
  .catch(err => {
    res.status(500).end('Internal Server Error"')
  })
})
server.listen(3000 ,()=> {
  console.log('"app listening at http://localhost:port');
})