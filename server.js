var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// 路由
app.use('/public', express.static('public'));
app.use('/node_modules/socket.io/client-dist', express.static('node_modules/socket.io/client-dist'))
app.get('/', function(req, res){
    res.redirect('/public/');
});
// 监听端口
var server = app.listen(8080, function () {
    var port = server.address().port;
    console.log("聊天室demo，listening on *:%s", port);
  });
io = io.listen(server, { cors: true });
 

var onlineUsers = new Array();
// 公共空间
const pub_space = io.of('/');
pub_space.on('connection', function(socket){
    // 用户加入，自定义事件
    socket.on('login',function(user){
        if(!onlineUsers.hasOwnProperty(socket.id)) {
            //在线用户定义
            onlineUsers[socket.id] = {
                username: user.username,
                avatar: user.avatar
            }
        }
        pub_space.broadcast.to(socket.id).emit('attend', onlineUsers);
        console.log('['+onlineUsers[socket.id]+']加入了公共大厅');
    });
    // 用户退出
    socket.on('disconnect', function(){
        if(onlineUsers.hasOwnProperty(socket.id)) {
            delete onlineUsers[socket.id];
        }
        pub_space.broadcast.to(socket.id).emit('exit', onlineUsers);
        console.log('['+onlineUsers[socket.id]+']退出了公共大厅');
    });
    // 用户消息，自定义事件
    socket.on('message', function(obj){
        pub_space.to(socket.id).emit('message', obj);
        console.log(obj.username+'说：'+obj.content);
    });
});
   

