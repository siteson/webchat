let websocket = new WebSocket(wsConfig.WS_ROOT_PATH)
websocket.onopen = () => {
  console.log('websocket连接开启...')
  if (!this.chatId) {
    this.initChatId()
  }
  this.sendUserName()
}
websocket.onmessage = event => {
  let data = event.data
  let result = JSON.parse(data)
  let code = result.code
  let count = result.count
  this.updateChatCount(count)
  if (code === RECEIEVE_MESSAGE) {
    this.pushMessage(result)
    this.onMessageScroll()
  } else if (code === SAVE_USER_INFO || code === CLOSE_CONNECTION) {
    this.updateChatUser(result.chatUsers)
  }
  console.log('数据已接收...', code, result)
}
websocket.onclose = this.onWebsocketClose
websocket.onerror = this.onWebsocketError

// 发送message
function sendMessage(info) {
  if (this.websocket && typeof this.websocket.send === 'function') {
    this.websocket.send(JSON.stringify(info))
  }
}

// 前端代码监听页面关闭或者刷新
window.onunload = () => {
    this.closeConnect()
  }
// vue里跳转到其它页面
function beforeRouteLeave(to, from, next) {
this.closeConnect()
next()
}