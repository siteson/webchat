/****************************************************************
 * socket.io官方文档：https://socketio.bootcss.com/docs/
 * 任务说明：
 * 系统会话：提示user发送一个字符串作为username
 * 公共大厅：提示进入会话大厅，开始群聊
 * 私密会话：点对点消息传输
 * user数据包括：userid，username，头像url，room
 ***************************************************************/

window.CHAT = {
    userid: null,
    username: null,
    avatar: null,

    socket: null,
    // 公共空间
    init: function(){
        // var host = "ws://"+location.hostname+":"+location.port;
        // this.socket = io.connect(host);
        const pub_space = io();
        this.socket = pub_space;
        pub_space.on("connect", () => {
            this.userid = pub_space.id;
            // 加入会话
            if(this.userid!=null && this.username!=null)
            pub_space.emit('login', {
                username: this.username,
                avatar: this.avatar
            });
            $("#title").text("公共空间");
            $("#message").attr("placeholder" , "来说点什么吧");
        })

        // 监听用户加入
        pub_space.on('attend', (user, count)=>{
            systemMessage("欢迎["+user+"]加入会话");
            $("#count").text("（"+count+"人在线）");
        });

        //监听用户退出
        pub_space.on('exit', (user, count)=>{
            systemMessage("["+user+"]退出了会话");
            $("#count").text("（"+count+"人在线）");
        });

        //监听用户消息
        pub_space.on('message', (msg)=>{
            if(msg.userid != this.userid){
                getMessage({
                    username: msg.username,
                    avatar: msg.avatar
                },msg.message);
            }
        });
    },

    // 发送消息
    submit: function(){
        var msg = $('#message').val();
        if (msg){
            if(this.username === null){
                this.username = msg;
                this.avatar = getAcatar();
                sendMessage({
                    username: this.username,
                    avatar: this.avatar
                },msg);
                this.init();
            }
            else{
                // message 数据结构
                this.socket.emit('message', {
                    userid: this.userid,
                    username: this.username,
                    avatar: this.avatar,
                    message: msg
                });
                sendMessage({
                    username: this.username,
                    avatar: this.avatar
                },msg);
            }
        }
        $('#message').val("");
        return false;
    }
}


function getAcatar(){
    var src = null;
    $.ajax({
        type: "GET",
        url: "https://api.uomg.com/api/rand.avatar?sort=动漫男&format=json",
        async: false,   // 同步请求
        success: (response) => {
            src = JSON.parse(response).imgurl;
        }
    });
    return src;
}
function systemMessage(msg){
    $("#messagebox").append("<div class='chat-line system-message'>"+msg+"</div>");
}
function timestemp(){
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    return hour+":"+minute;
}
// @param user {username:string, avatar:string}
function sendMessage(user,message){
    var datetime = timestamp();
    var sendmsg = "\
        <div class=chat-line><div class='direct-chat-msg right textwidth'>\
        <div class='direct-chat-infos clearfix'><span class='direct-chat-name float-right'>"+
        user.username +
        "</span><span class='direct-chat-timestamp float-right'>"+
        datetime +
        "</span></div><img class='direct-chat-img' src='"+
        user.avatar +
        "' alt='message user image'><div class='right direct-chat-text'>"+
        message +
        "</div></div></div>"
    $("#messagebox").append(sendmsg);
    var scrool = document.getElementById('messagebox');
    scrool.scrollTop = scrool.scrollHeight;
}
// @param user {username:string, avatar:string}
function getMessage(user,message){
    var datetime = timestamp();
    var sendmsg = "\
    <div class='chat-line'><div class='direct-chat-msg left textwidth'>\
        <div class='direct-chat-infos clearfix'><span class='direct-chat-name float-left'>"+
        user.username +
        "</span><span class='direct-chat-timestamp float-left'>"+
        datetime +
        "</span></div><img class='direct-chat-img' src='"+
        user.avatar +
        "' alt='message user image'><div class='left direct-chat-text'>"+
        message +
        "</div></div></div>"
    $("#messagebox").append(sendmsg);
    $("#messagebox").scrollTo(0, this.clientHeight);
}

$(document).ready(function(){
    $("#title").text("系统会话");
    $("#count").text("");
    $("#message").attr("placeholder" , "请输入你的昵称");
    systemMessage("欢迎来到聊天室，开始之前请先输入您的昵称，随便编一个就行");
});
$("#submit").click(function(){
    return CHAT.submit();
});