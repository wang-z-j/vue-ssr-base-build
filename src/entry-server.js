import { createApp } from './app'

export default async context => {
  const { app,router,store } = createApp()
  // const meta = app.$meta
  router.push(context.url)
  // context.meta = meta
  context.state = store.state
  await new Promise(router.onReady.bind(router))
  context.renderer = () => {
    context.state = stroe.state
  }
  return app
}