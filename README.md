# webchat

[![License](https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square)](https://github.com/siteson/webchat/blob/main/LICENSE)

这是一个使用 node.js 编写的全双工通信聊天室，会话大厅已经完成，私聊 room 的细节还未完善，有空会继续编写。相关技术逻辑请查阅 [socket.io](https://socket.io/docs/v3)

**体验成品小样：** 

![Desktop view]("https://raw.githubusercontent.com/siteson/webchat/main/readme_image/desktop.png")

![Mobile view]("https://raw.githubusercontent.com/siteson/webchat/main/readme_image/phone.png")

<br>

## 部署步骤：

### 通过 [NPM](https://www.npmjs.com/) 安装生产环境
`$ npm i`

### 启动服务器
`$ node server.node.js`

### 访问客户端
`http://localhost:8080`

<br>

## 文件说明：
|   文件            |   说明    |   备注    |
|   :----            |   :----    | :---- |
|   server.node.js  |  服务端   |  同时负责http和ws协议的路由、广播、监听
|   public/index.html   |   客户端 UI  |   通过http访问将被重定向到这个页面
|   public/js/wsclient.js   |   客户端  |   与服务器进行交互的业务逻辑

<br>
P.S. public/plugins/ 中的文件都是插件，其他文件要么是给npm看的，要么是给GitHub看的