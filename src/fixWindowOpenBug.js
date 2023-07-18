// 弹窗拦截， 测试一下
const fixWindowOpen = async displayProjectileFrame(type) {
  const title = '测试弹框拦截'
  // 先打开一个窗口
  let newWindow = window.open()
  //给新窗口设置标题
  newWindow.document.title = title
  newWindow.document.write("服务器正在处理中，请稍后");

  try {
    const base = 'xxxxxxxxxx'
    // 这里是模拟ajax，不同使用场景需要有所变化
    const openUrl = await this.$axiOS.$get('/xxx/xxxx', {
      params: {
        base
      }
    })

    if (openUrl) {
      // 重定向
      newWindow.location = openUrl
    } else {
      newWindow.document.write("服务器处理异常");
    }
  } catch (e) {
    console.log('error', e);
  }
}
