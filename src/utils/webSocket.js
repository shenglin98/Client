import { Message } from 'element-ui'
let socket = "";
let lockReconnect = false; //是否真正建立连接
let timeout = 20 * 1000; //20秒一次心跳
let timeoutObj = null; //心跳心跳倒计时
let serverTimeoutObj = null; //心跳倒计时
let timeoutnum = null;
let global_callback = null;
let weburl = `ws://101.200.229.181:9010`; // location.host 解析导航栏地址作为socketUrl
// let weburl = `ws://${location.host}`; // location.host 解析导航栏地址作为socketUrl

export const sendWebsocket = function(agentData, callback) {
    // global_callback = callback;
    socketOnSend(agentData);
}

/**
 * 关闭websocket函数
 */
export const closeWebsocket = function() {
    if (socket) {
        socket.close();
    }
    clearTimeout(timeoutObj);
    clearTimeout(serverTimeoutObj);
}

export const initWebSocket = function(url) {
    weburl = url || weburl;
    if (!window.WebSocket) {
        Message({
            message: "您的浏览器不支持websocket,请升级或更换浏览器！",
            type: 'error',
            center: true,
        })
        return;
    }
    if (!socket) {
        socket = new WebSocket(weburl + "/ws");
        socketOnOpen();
        // socketOnClose();
        socketOnError();
        socketOnMessage();
    }
}

function reconnect() {
    if (lockReconnect) {
        return;
    }
    lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    timeoutnum && clearTimeout(timeoutnum);
    timeoutnum = setTimeout(function() {
        //新连接
        initWebSocket();
        lockReconnect = false;
    }, 5000);
}
//重置心跳
function reset() {
    //清除时间
    clearTimeout(timeoutObj);
    clearTimeout(serverTimeoutObj);
    //重启心跳
    start();
}
//开启心跳
function start() {
    timeoutObj && clearTimeout(timeoutObj);
    serverTimeoutObj && clearTimeout(serverTimeoutObj);
    timeoutObj = setTimeout(function() {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (socket.readyState == 1) {
            //如果连接正常
            console.log("发送消息");
            // Message({
            //     message: "通讯连接成功！",
            //     type: 'success',
            //     center: true,
            // })
        } else {
            //否则重连
            reconnect();
        }
        serverTimeoutObj = setTimeout(function() {
            //超时关闭
            socket.close();
        }, timeout);
    }, timeout);
}

function socketOnOpen() {
    socket.onopen = () => {
        console.log("socket连接成功");
        Message({
            message: "socket连接成功!",
            type: 'success',
            center: true,
        })
        start();
    };
}

function socketOnClose() {
    socket.onclose = () => {
        console.log("socket已经关闭");
        Message({
            message: "socket已经关闭！",
            type: 'error',
            center: true,
        })
    };
}

function socketOnSend(data) {
    console.log(data, "发送");
    //数据发送
    socket.send(data);
}

function socketOnError() {
    socket.onerror = () => {
        reconnect();
        console.log("socket 链接失败");
        Message({
            message: "socket 链接失败！",
            type: 'error',
            center: true,
        })
    };
}

function socketOnMessage() {
    // return new Promise((resolve, reject) => {
    socket.onmessage = (e) => {
        console.log(e, 'e');
        // global_callback(e.data);
        reset();
        // resolve(e.data)
    };
    // })
}

// return new Promise((resolve, reject) => {
//     try {
//         return resolve(e.data);
//     } catch (err) {
//         return reject(err);
//     }
// });