/****************************************************************
 * socket.io官方文档：https://socketio.bootcss.com/docs/
 * 任务说明：
 * 系统会话：提示user发送一个字符串作为username
 * 公共大厅：提示进入会话大厅，开始群聊
 * 私密会话：点对点消息传输
 * user数据包括：userid，username，头像url，room
 ***************************************************************/

window.CHAT = {
    socket: null,
    userid: null,
    username: null,
    avatar: null,

    // 公共空间
    init: function(){
        // var host = "ws://"+location.hostname+":"+location.port;
        // this.socket = io.connect(host);
        const pub_space = io();
        this.socket = pub_space;
        pub_space.on("connect", (socket) => {
            this.userid = socket.id;
        })
        // 加入会话
        if(this.userid!=null && this.username!=null)
        pub_space.emit('login', {
            username: this.username,
            avatar: this.avatar
        });

        // 监听用户加入
        pub_space.on('attend', function(onlineUsers){
            systemMessage("欢迎["+onlineUsers[this.userid].username+"]加入会话");
            $("#count").text("（"+onlineUsers.length+"人在线）");
        });

        //监听用户退出
        this.pub_space.on('exit', function(onlineUsers){
            $("#count").text("（"+onlineUsers.length+"人在线）");
        });

        //监听消息发送
        pub_space.on('message', function(obj){
            var isme = (obj.userid == CHAT.userid) ? true : false;
            var contentDiv = '<div>'+obj.content+'</div>';
            var usernameDiv = '<span>'+obj.username+'</span>';

            var section = d.createElement('section');
            if(isme){
                section.className = 'user';
                section.innerHTML = contentDiv + usernameDiv;
            } else {
                section.className = 'service';
                section.innerHTML = usernameDiv + contentDiv;
            }
            CHAT.msgObj.appendChild(section);
            CHAT.scrollToBottom();
        });
    },

    // 发送消息
    submit: function(){
        var msg = $('#message').val();
        if (msg){
            if(this.username === null){
                this.username = msg;
                this.init();
            }
            else{
                this.socket.emit('message', {
                    userid: this.userid,
                    message: msg
                });

            }
        }
        return false;
    }
}

// UI
function systemMessage(msg){
    $("#messagebox").append("<div class='chat-line system-message'>"+msg+"</div>");
}
function sendMessage(user,message){
    var datetime = (new Date()).Format("hh:mm");
    var sendmsg = "\
        <div class=chat-line><div class='direct-chat-msg right textwidth'>\
        <div class='direct-chat-infos clearfix'><span class='direct-chat-name float-right'>"+
        user.username +
        "</span><span class='direct-chat-timestamp float-right'>"+
        datetime +
        "</span></div><img class='direct-chat-img' src='"+
        user.avatar +
        "' alt='message user image'><div class='direct-chat-text'>"+
        message +
        "</div></div></div>\
    "
    $("#messagebox").append(sendmsg);
}
function getMessage(user,message){
    
}

$(document).onload(function(){
    $("#title").text("系统会话");
    $("#count").text("");
    $("#message").attr("placeholder" , "请输入你的昵称");
    systemMessage("欢迎来到聊天室，开始之前请先输入您的昵称，随便编一个就行");
});
$("#submit").click(function(){
    return CHAT.submit();
})