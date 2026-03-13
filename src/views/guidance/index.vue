<template>
  <div>
    <el-button type="primary" @click="handleJoinRoom">连接进入</el-button>
    <el-button type="primary" @click="handleJoinRoom1">连接进入11111</el-button>
    <el-button type="primary" @click="handleLeaveRoom">离开房间</el-button>
    <el-button type="primary" @click="handleLeaveRoom1"
      >离开房间11111</el-button
    >
  </div>
</template>
<script>
export default {
  name: "",

  components: {},

  data() {
    return {
      //   path: "ws://101.200.229.181:9010",
      path: "ws://192.168.1.6:52789",
      socket: "",
      socket1111: "",
      userInfo: null,
    };
  },

  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("usernameOrId")) || null;
    // 初始化
    this.init();
  },

  methods: {
    init() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path + "/ws");
        this.socket1111 = new WebSocket(this.path + "/ws");
        console.log(this.socket, "socket");
        console.log(this.socket1111, "socket1111");
        // 监听socket连接
        this.socket.onopen = this.open;
        this.socket1111.onopen = this.open1;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        this.socket1111.onerror = this.error1;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
        this.socket1111.onmessage = this.getMessage1;
      }
    },
    open() {
      console.log("socket连接成功");
    },
    error() {
      console.log("连接错误");
    },
    open1() {
      console.log("socket连接成功1111111");
    },
    error1() {
      console.log("连接错误11111111");
    },
    getMessage(msg) {
      console.log(msg);
      if (this.isJSON(msg.data)) {
        console.log("我是xlcs接收");
        console.log(JSON.parse(msg.data));
      }
    },
    getMessage1(msg) {
      console.log(msg);
      if (this.isJSON(msg.data)) {
        console.log("我是System接收");
        console.log(JSON.parse(msg.data));
      }
    },
    isJSON(str) {
      try {
        JSON.parse(str);
      } catch {
        return false;
      }
      return true;
    },
    send(params) {
      console.log(params, "params");
      this.socket.send(params);
    },
    send1(params) {
      console.log(params, "params");
      this.socket1111.send(params);
    },
    close() {
      console.log("socket已经关闭");
    },
    handleJoinRoom() {
      this.send(
        JSON.stringify({
          action: "join",
          nick: this.userInfo.usercode,
          roomno: "Customer_triag_queue",
        })
      );
    },
    handleLeaveRoom() {
      this.send(
        JSON.stringify({
          action: "leave",
          nick: this.userInfo.usercode,
          roomno: "",
        })
      );
    },
    handleJoinRoom1() {
      this.send1(
        JSON.stringify({
          action: "join",
          nick: "System",
          roomno: "Customer_triag_queue",
        })
      );
    },
    handleLeaveRoom1() {
      this.send(
        JSON.stringify({
          action: "leave",
          nick: "System",
          roomno: "",
        })
      );
    },
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = this.close;
  },

  watch: {},

  computed: {},
};
</script>
<style lang='scss' scoped>
</style>