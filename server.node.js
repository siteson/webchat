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
var server = app.listen(88, function () {
    var port = server.address().port;
    console.log("聊天室demo，listening on *:%s", port);
  });
io = io.listen(server, { cors: true });
 

var onlineUsers = {};
// 公共空间
const pub_space = io.of('/');
pub_space.on('connection', function(socket){
    // 用户加入，自定义事件
    socket.on('login',function(user){
        if(!onlineUsers.hasOwnProperty(socket.id)) {
            //onlineUsers 数据结构
            onlineUsers[socket.id] = {
                username: user.username,
                avatar: user.avatar
            }
            var count = Object.keys(onlineUsers).length;
            // pub_space.to(socket.id).emit('attend', onlineUsers);
            pub_space.emit('attend', onlineUsers[socket.id].username, count);
            console.log('['+onlineUsers[socket.id].username+']加入了公共大厅'); 
        }
    });
    // 用户退出
    socket.on('disconnect', function(){
        if(onlineUsers.hasOwnProperty(socket.id)) {
            var count = Object.keys(onlineUsers).length -1;
            // pub_space.to(socket.id).emit('exit', onlineUsers);
            pub_space.emit('exit', onlineUsers[socket.id].username, count);
            try{
                console.log('['+onlineUsers[socket.id].username+']退出了公共大厅');
            }
            catch (e){
                console.log(e);
            }
            delete onlineUsers[socket.id];
        }
    });
    // 消息转发，自定义事件
    socket.on('message', function(msg){
        // pub_space.to(socket.id).emit('message', msg);
        pub_space.emit('message', msg);
        try{
            console.log(onlineUsers[msg.userid].username+'说：'+msg.message);
        }
        catch (e){
            console.log(e);
        }
    });
});
   

