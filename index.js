//express_demo.js 文件
var express = require('express');
var app = express();
app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  res.redirect('/public/');
})
 
var server = app.listen(8080,'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("聊天室demo，访问地址为 http://%s:%s", host, port)
})  