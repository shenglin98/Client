<template>
  <div class="app-wrapper" :class="classObj">
    <el-container class="flex-column">
      <el-header height="45px">
        <navbar></navbar>
        <div class="guidance_box" v-if="authStrategy == 'system' || userType.includes('导诊医生')">
          <el-button type="primary" plain size="small" @click="handleOpenGuidance">导诊</el-button>
          <div class="wait_box_no" v-if="waitLength == 0">当前状态：无人等候</div>
          <div class="wait_box_yes" :style="{color: waitLength>0 ? 'red' : '',}" v-else>
            <div>当前状态：等候人数{{waitLength}}</div>
          </div>
        </div>
      </el-header>
      <el-container class="flex-row flex-item">
        <sidebar class="sidebar-container"></sidebar>
        <div class="main-container flex-item">
          <tags-view class="custom-tags-view"></tags-view>
          <app-main v-if="isShowPage"></app-main>
        </div>
      </el-container>
    </el-container>
    <!-- 危急值弹框 -->
    <el-dialog title="危急值提醒" class="summaryDia" :visible.sync="showCriticalList" width="60%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <EasyTable :loading="loading" height="100%" class="table_100" style="height: 380px" :data="criticalList" :tableOptions="criticalListOptions" :radio-config="{ rowClick: true }" :row-style="rowstyle" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
      <span slot="footer" class="dialog-footer" style="text">
        <el-button type="primary" size="mini" @click="handleSubmitCriticalList">处 理</el-button>
        <el-button type="primary" plain size="mini" @click="handleCloseCriticalList">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 警告提示 -->
    <el-dialog title="警告" :show-close="false" :close-on-click-modal="false" :visible.sync="dialogFormVisible" class="page_dia">
      <div>{{ systemWarnContent }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseSystemWarn">关 闭</el-button>
      </div>
    </el-dialog>
    <Guidance v-if="showGuidance" @update="handleUpdateWaitLength" @hide="handleHide" @close="handleCloseGuidance" />
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import Vue from "vue";
import { mapGetters, mapActions, mapState } from "vuex";
import { getToken } from "@/utils/auth";
import {
  getNotConfirmCritical,
  getNotConfirmConfirm,
} from "@/api/dashboard.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import Guidance from "@/components/guidance";
import * as userlogin from "@/api/login";
import { TriagDetail, TriagOpen } from "@/api/triag.js";

export default {
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    Guidance,
  },
  data() {
    return {
      userInfo: null,
      isShowPage: true,
      loading: false,
      criticalList: [],
      showCriticalList: false,
      dialogFormVisible: false,
      systemWarnContent: "",
      socketUrlRes: null,
      showGuidance: false,
      showSmallGuidance: false,
      waitLength: 0,
      loginUserInfo: null,
      authStrategy: "",
      userType: [],
    };
  },
  mixins: [ResizeMixin],
  watch: {
    socketObj: {
      handler(newVal, oldVal) {
        console.log(newVal, "newVal");
        let that = this;
        let data = newVal;
        if (data.businessType == "Customer_triag_queueRoom") {
          console.log(data.RoomPaiDuiList.length, "6666");
          that.waitLength = data.RoomPaiDuiList.length;
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters(["name", "id", "account", "systemWarn", "isIdentityAuth"]),
    ...mapState({
      socketObj: (state) => state.user.socketObj,
    }),
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
    criticalListOptions() {
      return [
        {
          title: "姓名",
          prop: "name",
          width: 110,
          omit: 1,
        },
        {
          title: "项目",
          prop: "itemname",
          width: 180,
          omit: 1,
        },
        {
          title: "结果",
          align: "center",
          render: (h, data) => {
            return <span style="color:red">{data.result}</span>;
          },
        },
        {
          title: "提示",
          align: "center",
          width: 120,
          render: (h, data) => {
            return <span style="color:red">{data.tips}</span>;
          },
        },
        {
          title: "上下限",
          // prop: "reslower",
          align: "center",
          width: 120,
          render: (h, data) => {
            if (data.res_exp !== "") {
              return <div domPropsInnerHTML={data.res_exp}></div>;
            } else {
              return (
                <div>
                  {data.res_upper
                    ? `${data.res_lower} - ${data.res_upper}`
                    : `${data.res_lower}`}
                </div>
              );
            }
          },
        },
      ];
    },
  },
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      // beforeRouteENnter不能通过this访问组件实例，但是可以通过 vm 访问组件实例
      // vm.toggleSideBar();
    });
  },
  async mounted() {
    this.socketUrlRes = await getSysConfigInfo({
      cc: "Sys_WebSocket_Url",
    });
    this.socketUrlRes.result && this.localSocket(this.socketUrlRes.result);
    this.userInfo = JSON.parse(localStorage.getItem("usernameOrId")) || null;
    userlogin.GetMyOrgs().then((response) => {
      if (!response.result) return;
      this.loginUserInfo = response.result;
      this.authStrategy = this.loginUserInfo.authStrategy.toLowerCase() || "";
      this.userType = this.loginUserInfo.userType.split(",") || [];
      console.log(this.authStrategy, "this.authStrategy");
      console.log(this.userType, "this.userType");
    });
    // this.$nextTick(() => {
    //   setTimeout(() => {
    //     this.handdleMsg(
    //       JSON.stringify({
    //         action: "join",
    //         nick: `${localStorage.getItem("md5code")},${
    //           this.userInfo.usercode
    //         }`,
    //         roomno: "AllowSingleLogin",
    //       })
    //     );
    //   }, 1000);
    // });
    let jump = await getSysConfigInfo({
      cc: "Sys_Module_Jump",
    });
    Vue.prototype.Hospitals = (jump && jump.result) || "index";
    Vue.prototype.$reload = this.reload;
    if (
      localStorage.getItem("md5code") == null ||
      localStorage.getItem("md5code") == undefined ||
      localStorage.getItem("md5code") == ""
    ) {
      this.getFingerprintMd5Code();
    }
    let isDialog = JSON.parse(localStorage.getItem("isDialog"));
    if (isDialog && this.systemWarn) {
      this.systemWarnContent = this.systemWarn;
      this.dialogFormVisible = true;
    }
    let isCheck = false;
    let isCheckArr = [];
    let res = await getSysConfigInfo({
      cc: "Sys_CustomerCriticalAllowSeeUsers",
    });
    if (res.result) {
      isCheckArr = res.result.split(",");
    }
    if (
      (isCheckArr.includes(this.getCookie("username")) &&
        this.Hospitals === "index_qyzyy") ||
      this.Hospitals === "index_gyey"
    ) {
      this.handleIsCheckCritical();
    }
    if (this.authStrategy == "system" || this.userType.includes("导诊医生")) {
      this.handleTriagDetailNew();
    }

    window.addEventListener("beforeunload", (e) => this.beforeunloadHandler(e));
  },
  //页面销毁前解除监听
  destroyed() {
    window.removeEventListener("beforeunload", (e) =>
      this.beforeunloadHandler(e)
    );
  },
  methods: {
    // 获取医生当天诊室-新
    handleTriagDetailNew() {
      TriagDetail().then((res) => {
        if (!res.result) return;
        if (res.result.isSave) {
          TriagOpen({
            roomcode: res.result.roomcode,
            queuecode: res.result.queuecode,
          }).then((res) => {});
        }
      });
    },
    handleUpdateWaitLength(length) {
      this.waitLength = length || 0; // 显示小浮窗
    },
    handleHide(length) {
      this.showGuidance = false; // 关闭叫号窗口
      this.waitLength = length || 0; // 显示小浮窗
    },
    handleOpenGuidance() {
      this.showGuidance = true; // 关闭叫号窗口
    },
    handleCloseGuidance() {
      this.showGuidance = false; // 关闭叫号窗口
    },
    ...mapActions(["signOutOidc", "saveTheme"]),
    beforeunloadHandler(e) {
      this.$global.ws.onclose();
    },
    //app.vue
    async localSocket(url) {
      let that = this;
      if ("WebSocket" in window) {
        console.log("您的浏览器支持 WebSocket!");
        that.ws = new WebSocket(
          `ws://${
            this.socketUrlRes.result
          }/ws?x-token=${getToken()}&fc=${localStorage.getItem("md5code")}`
        );
        // that.ws = new WebSocket("ws://192.168.4.253:8081/ws");
        that.$global.setWs(that.ws);
        that.ws.onopen = function () {
          console.log("开始连接");
          that.handdleMsg(
            that.jsonSf({
              action: "checkconnect",
            })
          );
        };
        //that.onopen(); 这个地方未定义是会报错，所以我写成了  that.ws.onopen = function() {console.log('开始连接')};

        that.ws.onclose = function () {
          // 关闭 websocket
          console.log("连接已关闭...");
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
    // 发送和接收消息
    handdleMsg(msg) {
      let that = this;
      console.log(that.$global.ws);
      if (that.$global.ws && that.$global.ws.readyState == 1) {
        console.log("发送信息", msg);
        that.$global.ws.send(msg);
      }
      that.$global.ws.onmessage = function (msg) {
        console.log("收到服务器内容APP.vue", JSON.parse(msg.data));
        if (msg.data != "连接成功" && JSON.parse(msg.data)) {
          const data = JSON.parse(msg.data);
          that.$store.dispatch("setsocketObj", data);
          // if (data.isLoginOut) {
          //   that
          //     .$confirm("此账号已在别处登录!", "提示", {
          //       confirmButtonText: "确定",
          //       showCancelButton: false,
          //       showClose: false,
          //       closeOnClickModal: false,
          //       closeOnPressEscape: false,
          //       type: "warning",
          //     })
          //     .then(() => {
          //       that.logout();
          //     })
          //     .catch(() => {});
          // }
        }
      };
    },
    logout() {
      let that = this;
      that.$global.ws.onclose();
      if (that.isIdentityAuth) {
        that.signOutOidc();
      } else {
        that.$store.dispatch("LogOut").then(() => {
          localStorage.removeItem("userId");
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      }
    },
    handleCloseSystemWarn() {
      localStorage.setItem("isDialog", JSON.stringify(false));
      this.systemWarnContent = "";
      this.dialogFormVisible = false;
    },
    // 获取cookie
    getCookie(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + "=");
        if (start !== -1) {
          start = start + key.length + 1;
          var end = document.cookie.indexOf(";", start);
          if (end === -1) end = document.cookie.length;
          return unescape(document.cookie.substring(start, end));
        }
      }
      return "";
    },
    handleIsCheckCritical() {
      if (JSON.parse(localStorage.getItem("critical"))) {
        getNotConfirmCritical({
          whereitems: [],
          page: 1,
          limit: 100000,
        }).then((res) => {
          localStorage.setItem("critical", JSON.stringify(false));
          if (!res.data) return;
          this.criticalList = res.data;
          this.showCriticalList = true;
        });
      }
      setInterval(() => {
        let time = new Date(+new Date() + 8 * 3600 * 1000)
          .toJSON()
          .substr(11, 19)
          .replace("T", " ")
          .split(".")[0];
        if (time === "11:00:00" || time === "16:30:00") {
          this.handleGetNotConfirmCritical();
        }
      }, 1000);
    },
    // 危急值提交
    handleSubmitCriticalList() {
      let regiditems = this.criticalList.map((k) => {
        return k.regid;
      });
      let combinecodeitems = this.criticalList.map((k) => {
        return k.combinecode;
      });
      let itemcodeitems = this.criticalList.map((k) => {
        return k.itemcode;
      });
      getNotConfirmConfirm({
        regiditems,
        combinecodeitems,
        itemcodeitems,
      }).then((res) => {
        this.$message.success("操作成功");
        this.handleCloseCriticalList();
      });
    },
    // 危急值关闭
    handleCloseCriticalList() {
      this.showCriticalList = false;
      localStorage.setItem("critical", JSON.stringify(false));
    },
    // 危急值
    handleGetNotConfirmCritical() {
      getNotConfirmCritical({
        whereitems: [],
        page: 1,
        limit: 100000,
      }).then((res) => {
        if (!res.data) return;
        this.criticalList = res.data;
        this.showCriticalList = true;
      });
    },
    toggleSideBar() {
      this.$store.dispatch("CloseSideBar", false);
    },
    reload: function () {
      this.isShowPage = false;
      this.$nextTick(function () {
        this.isShowPage = true;
      });
    },
    handleClickOutside() {
      this.$store.dispatch("CloseSideBar", { withoutAnimation: false });
    },
    getGuid() {
      //修订的另外一个版本
      var guid = "";
      for (var i = 1; i <= 32; i++) {
        var g = Math.floor(Math.random() * 16).toString(16);
        guid += g;
        if (i == 8 || i == 12 || i == 16 || i == 20) {
          guid += "";
        }
      }
      return guid.toUpperCase();
    },
    getFingerprintMd5Code() {
      let _that = this;
      let excludes = {};
      let options = { excludes: excludes };
      Fingerprint2.get(options, function (components) {
        // 参数
        const values = components.map(function (component) {
          if (component.key == "canvas") {
            return component.value;
          }
        });
        // 指纹
        const murmur = _that.getGuid();
        // const murmur = Fingerprint2.x64hash128(values.join(""), 31);
        localStorage.setItem("md5code", murmur);
      });
    },
    // 表格文本变色
    rowstyle({ row, rowIndex }) {
      let stylejson = {};
      if (row.healthstatus == 1) {
        // stylejson.background = "#e0838f"; // 背景颜色
        // 也可以修改文字颜色
        stylejson.color = "red !important";
        return stylejson;
      } else if (row.healthstatus == -1) {
        stylejson.color = "#0000ff !important";
        return stylejson;
      }
      return "";
    },
    // 表头样式调整
    handleReturnStyle({ row, rowIndex }) {
      let stylejson = {};
      // stylejson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      stylejson.color = "#000";
      stylejson["font-weight"] = "bold";
      stylejson.background = "#d0ddeb";
      return stylejson;
    },
    // 表格斑马纹颜色调整
    handleTableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "statistics-warning-row";
      } else {
        return "";
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.el-header {
  padding: 0;
  line-height: 44px;
  background-color: #333;
  width: 100%;
  z-index: 100;
  .navbar {
    background: url("~@/assets/header/header_bg.png") no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
    height: 100%;
  }
}
.summaryDia {
  /deep/.el-dialog__body {
    padding: 0 20px;
  }
  /deep/.el-dialog__footer {
    text-align: center;
  }
}
.el-container .sidebar-container {
  height: auto !important;
}

.el-container .main-container {
  margin-left: 0 !important;
  overflow: hidden;
}
/deep/.el-table,
/deep/.vxe-table {
  color: #000 !important;
  input {
    color: #000 !important;
  }
}
/deep/.el-input {
  .el-input__inner {
    color: #000 !important;
  }
  input {
    color: #000 !important;
  }
}
.custom-tags-view {
  margin-top: 0 !important;
}
/deep/.el-form .el-form-item .el-form-item__label:before {
  font-size: 18px !important;
}
/*vxe-table 自定义行高 */
/deep/.vxe-table .vxe-body--column.col--ellipsis {
  height: 36px;
}
/deep/.vxe-table .vxe-body--column:not(.col--ellipsis),
/deep/.vxe-table .vxe-footer--column:not(.col--ellipsis),
/deep/.vxe-table .vxe-header--column:not(.col--ellipsis) {
  padding: 5px 0;
  height: 36px;
}

/deep/.vxe-table--tooltip-wrapper {
  z-index: 999999 !important;
}
.guidance_box {
  width: 350px;
  height: 44px;
  position: absolute;
  right: 420px;
  top: 0;
  display: flex;
  align-items: center;
  .wait_box_no,
  .wait_box_yes {
    margin-left: 15px;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
