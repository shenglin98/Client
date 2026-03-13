<template>
  <div class="triagcallmobile">
    <div class="head_box">
      <div class="logo_box">
        <img class="logo_img" src="../../assets/logo.png" draggable="false" alt="" />
        <div class="logo_title">禾创科技</div>
      </div>
      <div class="dept_box">{{ roommeg.queuename }}</div>
      <div class="name_box">医生：{{ doctorname }}</div>
    </div>
    <div class="time_box">
      <div class="temp"></div>
      <div class="date_box">{{ today }}　{{ weekDay }}</div>
      <div class="nwotime_box">
        <div class="ntb_bg">{{ currentTime.substr(0, 5) }}</div>
      </div>
    </div>
    <div class="content">
      <div class="deptname">{{ roommeg.roomname }}</div>
      <div class="currentvisit">
        <div class="cvtitle">正在就诊</div>
        <div class="cvcontent">
          <div class="cvccode">{{ checkingitem.queueno }}</div>
          <div class="cvcname">{{ checkingitem.name }}</div>
        </div>
      </div>
      <div class="waitvisit">
        <div class="wvtitle">等待就诊</div>
        <div class="wvcontent">
          <div class="wvcpone" v-if="paiduiitems.length > 0">
            {{ paiduiitems[0].queueno }} {{ paiduiitems[0].name }}
          </div>
          <div class="wvcptwo" v-if="paiduiitems.length > 0">
            {{ paiduiitems[1].queueno }} {{ paiduiitems[1].name }}
          </div>
        </div>
      </div>
      <div class="kindreminder">
        <div class="kmtitle">温馨提示</div>
        <div class="kmcontent">
          <div class="text" v-html="roommeg.reminder"></div>
          <!-- <div class="text">2过号需重叫的客户请与 咨询台工作人员联系。</div> -->
        </div>
      </div>
      <div class="bottom_box">过号(请与前台联系):{{ guohaoStr }}</div>
    </div>
  </div>
</template>
<script>
import { TriagRoomDetail, SmallScreen } from "@/api/triag.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import { getToken } from "@/utils/auth";
import Speech from "speak-tts";
const synth = window.speechSynthesis; // 启用文本
const msg = new SpeechSynthesisUtterance();
export default {
  name: "",

  components: {},

  data() {
    return {
      today: new Date(+new Date() + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 10)
        .replace("T", " "),
      weekDay: this.getWeekDay(),
      intervalId: null,
      currentTime: new Date().toLocaleTimeString(), // 获取当前时间
      roomcode: "",
      socketUrlRes: null,
      roommeg: {},
      doctorname: "",
      checkingitem: {},
      paiduiitems: [],
      guohaoStr: "",
      speakText: "",
      speech: null,
    };
  },
  computed: {},
  created() {
    this.$nextTick(() => {
      // 禁用右键
      document.oncontextmenu = function () {
        return false;
      };
      // 禁用选择
      document.onselectstart = function () {
        return false;
      };
    });
  },
  async mounted() {
    this.updateClock(); // 组件挂载后立即更新时钟
    this.roomcode = this.$route.query.roomcode || "";
    this.roomcode && this.handleTriagRoomDetail();
    this.socketUrlRes = await getSysConfigInfo({
      cc: "Sys_WebSocket_Url",
    });
    this.socketUrlRes.result && this.localSocket(this.socketUrlRes.result);
    this.speechInit();
  },

  methods: {
    speakTtsSpeech() {
      this.speech.speak({ text: this.speakText }).then(() => {
        console.log("读取成功");
      });
    },
    speechInit() {
      this.speech = new Speech();
      this.speech.setLanguage("zh-CN");
      this.speech.init().then(() => {});
    },
    // 获取当前诊室信息
    handleTriagRoomDetail() {
      TriagRoomDetail({ roomcode: this.roomcode }).then((res) => {
        if (!res.result) {
          this.$message.warning("暂无数据!");
          return;
        }
        this.roommeg = res.result;
        this.roommeg.reminder = this.replaceAll(
          this.roommeg.reminder,
          "|",
          "<br/>"
        );
      });
    },
    // 发送和接收消息
    handdleMsg(msg) {
      let that = this;
      console.log(that.$globalh5.ws);
      if (that.$globalh5.ws && that.$globalh5.ws.readyState == 1) {
        console.log("发送信息", msg);
        that.$globalh5.ws.send(msg);
      }
      that.$globalh5.ws.onmessage = function (msg) {
        console.log("收到服务器内容", msg);
        if (msg.data != "连接成功" && JSON.parse(msg.data)) {
          const data = JSON.parse(msg.data);
          console.log("收到data", data);
          that.doctorname = data.doctorname;
          data.Id &&
            SmallScreen({
              roomcode: that.roomcode,
              datetime: that.today,
            }).then((res) => {
              if (!res.result) {
                that.$message.warning("暂无数据!");
                return;
              }
              that.checkingitem = res.result.checkingitem;
              that.paiduiitems = res.result.paiduiitems;
              that.guohaoStr = "";
              that.speakText = `请${that.checkingitem.name}到诊室就诊`;
              that.speakText && that.speakTtsSpeech();
              //   that.$refs.myButton.$el.click();
              for (let i = 0; i < res.result.guohaoitems.length; i++) {
                let item = res.result.guohaoitems[i];
                if (that.guohaoStr.length == 0) {
                  that.guohaoStr += `${item.queueno} ${item.name}`;
                } else {
                  that.guohaoStr += `，${item.queueno} ${item.name}`;
                }
              }
            });
        }
      };
    },
    // 语音播报的函数
    handleSpeak() {
      console.log("111111");
      msg.text = this.speakText; // 内容
      msg.lang = "zh-CN"; // 使用的语言:中文
      msg.volume = 1; // 声音音量：1
      msg.rate = 1; // 语速：1
      msg.pitch = 1; // 音高：1
      synth.speak(msg); // 播放
    },
    // 语音停止
    handleStop(e) {
      msg.text = e;
      msg.lang = "zh-CN";
      synth.cancel(msg); // 取消该次语音播放
    },
    replaceAll(str, find, replace) {
      return str.split(find).join(replace);
    },
    async localSocket(url) {
      let that = this;
      if ("WebSocket" in window) {
        console.log("您的浏览器支持 WebSocket!");
        that.cllnumws = new WebSocket(
          `ws://${
            this.socketUrlRes.result
          }/ws?OutUserCode=${this.generateGUID()}&fc=${localStorage.getItem(
            "md5code"
          )}`
        );
        // that.ws = new WebSocket("ws://192.168.4.253:8081/ws");
        that.$globalh5.setWs(that.cllnumws);
        that.cllnumws.onopen = function () {
          console.log("开始连接叫号Socket");
          that.handdleMsg(
            that.jsonSf({
              action: "join",
              nick: that.roomcode,
              roomno: "CheckForRoomNo",
            })
          );
        };
        //that.onopen(); 这个地方未定义是会报错，所以我写成了  that.ws.onopen = function() {console.log('开始连接')};

        that.cllnumws.onclose = function () {
          // 关闭 websocket
          console.log("叫号Socket连接已关闭...");
          setTimeout(() => {
            that.localSocket();
          }, 2000);
        };
      } else {
        // 浏览器不支持 WebSocket
        console.log("您的浏览器不支持 WebSocket!");
      }
    },
    jsonSf(data) {
      return JSON.stringify(data);
    },
    updateClock() {
      this.intervalId = setInterval(() => {
        this.currentTime = new Date().toLocaleTimeString(); // 更新当前时间
      }, 1000); // 每秒更新一次
    },
    generateGUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    getWeekDay() {
      const days = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      const now = new Date();
      return days[now.getDay()];
    },
    pad(number) {
      return number < 10 ? "0" + number : number;
    },
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  watch: {},
};
</script>
<style lang='scss' scoped>
.triagcallmobile {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .head_box {
    width: 100%;
    height: 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo_box {
      width: 30%;
      display: flex;
      align-items: center;
      justify-content: center;
      .logo_img {
        width: 2rem;
      }
      .logo_title {
        margin-left: 5px;
        font-size: 4vw;
        color: #3378df;
      }
    }
    .dept_box {
      width: 40%;
      height: 100%;
      background: linear-gradient(to bottom, #54a2cf, #2078a8);
      border-radius: 0 0 2rem 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 6vw;
      margin-top: -0.6rem;
    }
    .name_box {
      width: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;
      font-size: 4vw;
    }
  }
  .time_box {
    width: 100%;
    height: 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 2rem 2rem 0 0;
    background: linear-gradient(to bottom, #88ccf2, #48a1c3);
    .temp {
      width: 30%;
    }
    .date_box {
      width: 40%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      font-size: 4vw;
      color: #fff;
      font-weight: 600;
    }
    .nwotime_box {
      width: 30%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .ntb_bg {
        width: 20vw;
        height: 80%;
        background-image: url("../../assets/time.png");
        background-size: 100% 100%;
        font-weight: 600;
        color: #fff;
        display: flex;
        font-size: 4.5vw;
        align-items: center;
        padding-left: 6.5vw;
        box-sizing: border-box;
      }
    }
  }
  .content {
    width: 100%;
    height: 90%;
    background-image: url("../../assets/bgjh.png");
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 0.5rem;
    position: relative;
    .deptname {
      background: linear-gradient(to bottom, #82bfe6, #1b416d);
      width: 100%;
      height: 17%;
      border: 0.3rem solid #1c4572;
      border-radius: 1rem 1rem 0 0;
      color: #fff;
      font-size: 14vw;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .currentvisit {
      width: 100%;
      height: 17%;
      border: 0.3rem solid #1c4572;
      border-top: 0 none;
      display: flex;
      .cvtitle {
        background-color: #d4e6f0;
        width: 29%;
        border-right: 0.3rem solid #1c4572;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #183f6a;
        font-weight: 600;
        font-size: 5.5vw;
      }
      .cvcontent {
        width: 71%;
        background-color: #46759f;
        color: #fffd55;
        font-weight: 600;
        font-size: 5vw;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
    }
    .waitvisit {
      width: 100%;
      height: 26%;
      border: 0.3rem solid #1c4572;
      border-top: 0 none;
      display: flex;
      .wvtitle {
        background-color: #d4e6f0;
        width: 29%;
        border-right: 0.3rem solid #1c4572;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #183f6a;
        font-weight: 600;
        font-size: 5.5vw;
      }
      .wvcontent {
        width: 71%;
        .wvcpone {
          width: 100%;
          height: 50%;
          background-color: #46759f;
          border-bottom: 0.3rem solid #1c4572;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-weight: normal;
          font-size: 5vw;
        }
        .wvcptwo {
          height: 50%;
          width: 100%;
          background-color: #46759f;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-weight: normal;
          font-size: 5vw;
        }
      }
    }
    .kindreminder {
      width: 100%;
      height: 33%;
      border: 0.3rem solid #1c4572;
      border-radius: 0 0 1rem 1rem;
      border-top: 0 none;
      display: flex;
      overflow: hidden;
      .kmtitle {
        background-color: #d4e6f0;
        width: 29%;
        border-right: 0.3rem solid #1c4572;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #183f6a;
        font-weight: 600;
        font-size: 5.5vw;
      }
      .kmcontent {
        width: 71%;
        background-color: #46759f;
        color: #fff;
        font-weight: normal;
        font-size: 4vw;
        box-sizing: border-box;
        padding: 0.5rem;
        overflow-y: auto;
      }
    }
    .bottom_box {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 5%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 2rem 2rem 0 0;
      background: linear-gradient(to bottom, #88ccf2, #48a1c3);
      color: #fff;
      font-size: 4vw;
    }
  }
}
</style>