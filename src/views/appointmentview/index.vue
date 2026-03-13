<template>
  <div>
    <!-- 按钮 -->
    <div class="btnBox">
      <el-button-group>
        <el-button
          type="primary"
          :class="[btnFlag === true ? 'btnFlagClas fontSize' : 'fontSize']"
          plain
          size="mini"
          @click="btnFlag = true"
          >日历视图</el-button
        >
        <el-button
          type="primary"
          :class="[btnFlag === false ? 'btnFlagClas  fontSize' : 'fontSize']"
          plain
          size="mini"
          @click="btnFlag = false"
          >项目试图</el-button
        >
      </el-button-group>
      <el-button-group>
        <el-button
          v-for="(monthItem, i) in month"
          :key="i + monthItem"
          type="primary"
          :class="[monthFlag == i ? 'btnFlagClas  fontSize' : 'fontSize']"
          plain
          size="mini"
          @click="SetDate(i)"
          >{{ monthItem }}</el-button
        >
      </el-button-group>
      <el-button-group>
        <el-button type="primary" class="fontSize" plain size="mini" @click="ShutDown()"
          >关闭</el-button
        >
      </el-button-group>
    </div>
    <div class="appointmentView">
      <!-- 头部操作控件 -->
      <!-- <sticky :className="'sub-navbar'">
        <div class="filter-container">
          <permission-btn moduleName="appointment" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
        </div>
      </sticky> -->

      <!-- 主体 -->
      <div class="bodymain">
        <div class="itemBox">
          <!-- 检索 -->
          <div class="searchBox" v-show="!btnFlag">
            <span class="span">检索:&#X3000; </span>
            <el-input
              class="input"
              size="mini"
              type="text"
              v-model="search"
              @change="searhFun()"
              placeholder="请输入检索内容"
            ></el-input>
          </div>
          <!-- 日历列表渲染 -->
          <div class="calendar_box">
            <!-- 左侧项目box -->
            <div class="leftTable" v-if="!btnFlag">
              <EasyTable
                :loading="loading"
                height="100%"
                class="table_appointment"
                :data="appointment"
                ref="combineone"
                :tableOptions="tableOptions"
                :checkbox-config="{ fetch: true, rowClick: true }"
                @selection-change="handleSelectIntment"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :row-style="{ height: '32px' }"
                :cell-style="{ padding: '0' }"
              />
            </div>

            <div>
              <div class="weeks_box" v-if="calendarList.length > 0">
                <div class="mon">一</div>
                <div class="tue">二</div>
                <div class="wed">三</div>
                <div class="thu">四</div>
                <div class="fri">五</div>
                <div class="sat">六</div>
                <div class="sun">日</div>
              </div>

              <!-- 日历内容列表 -->
              <div class="calendar_list">
                <!-- 空值占位符 -->
                <template v-if="sortIndex > 0">
                  <div
                    class="calendar_item empty"
                    v-for="item in sortIndex - 1"
                    :key="item"
                  ></div>
                </template>
                <div
                  class="calendar_item"
                  v-for="(item, index) in calendarList"
                  :key="index + item.title"
                >
                  <div class="item_head">{{ item.title }}</div>
                  <div
                    class="item_content"
                    v-for="value in item.contentitems"
                    :key="value.timeid"
                  >
                    <div class="type">
                      <span class="span">类型</span>
                      <span
                        class="span"
                        @click="agreed(item.title)"
                        style="cursor: pointer"
                        >已约</span
                      >
                      <span class="span">剩余</span>
                    </div>
                    <div class="individual">
                      <span class="span" style="background-color: #c280ff">个检</span>
                      <span class="span" style="background-color: #ec808d">{{
                        value.personcount
                      }}</span>
                      <span class="span" style="background-color: #70b603">{{
                        value.personusedcount
                      }}</span>
                    </div>
                    <div class="team">
                      <span class="span" style="background-color: #c280ff">团检</span>
                      <span class="span" style="background-color: #ec808d">{{
                        value.companycount
                      }}</span>
                      <span class="span" style="background-color: #70b603">{{
                        value.companyusedcount
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- table-hidden -->
              <el-dialog
                title="查看明细"
                class="dialogClas"
                :show-close="false"
                :destroy-on-close="true"
                :visible.sync="dialogTableVisible"
                :close-on-click-modal="false"
                @close="DialogShutDown"
              >
                <div class="notice_shutDown">
                  <el-button-group>
                    <el-button type="primary" plain size="mini" @click="notice"
                      >通知</el-button
                    >
                    <el-button type="primary" plain size="mini" @click="DialogShutDown"
                      >关闭</el-button
                    >
                  </el-button-group>
                </div>
                <div class="handoff">
                  <el-button-group>
                    <el-button
                      type="primary"
                      plain
                      size="mini"
                      v-for="(item, index) in examineBtn"
                      :key="index"
                      :class="[examineBtnFlag == index ? 'btnFlagClas' : '']"
                      @click="examineFun(index)"
                      >{{ item }}</el-button
                    >
                  </el-button-group>
                  <div class="retrievalBox">
                    <span>姓名:&#X3000;</span>
                    <el-input
                      v-model="retrieval"
                      @keydown.enter="retrievalFun"
                      @change="retrievalFun"
                      size="mini"
                      placeholder="请输入检索内容"
                    ></el-input>
                  </div>
                </div>
                <EasyTable
                  :loading="loading"
                  height="100%"
                  class="table_appointment"
                  :data="dialogData"
                  ref="dialog"
                  :tableOptions="dialogOptions"
                  :checkbox-config="{ fetch: true, rowClick: true }"
                  @selection-change="DialogSelectIntment"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :row-style="{ height: '32px' }"
                  :cell-style="{ padding: '0' }"
                />
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  GetAppointmentTimeLoad,
  AppointmentCustomerLoad,
} from "@/api/appointmentview.js";
import permissionBtn from "@/components/PermissionBtn";
import Sticky from "@/components/Sticky"; // 引入按钮组
import { mapGetters } from "vuex";
export default {
  components: { Sticky, permissionBtn },
  data() {
    return {
      loading: false, // 表格加载效果
      btnFlag: true, // 按钮样式开关
      pageflag: false,
      mode: "", // 排期方式
      days: "", // 间隔天数
      weekCheck: [], // 周几多选选中
      startTime: "", // 排期参数开始时间
      endTime: "", // 排期参数结束时间
      assignPersonnel: "", // 排期参数每天分配人员
      calendarList: [], // 日历列表渲染数据对象
      sortIndex: 0, // 日历列表第一天数据是星期几 起始渲染地点
      showFormBox: false, // 是否显示表单盒子
      chooseObj: undefined, // 选中数据回调
      appointment: [
        { code: "1", name: "测试" },
        { code: "1", name: "测试" },
        { code: "1", name: "测试" },
      ], // 左侧表格数据
      month: ["上月", "本月", "下月"], // '上月','本月','下月'
      monthFlag: 1, // 默认 本月flag
      search: "", // 检索内容
      dialogTableVisible: false, // 详情明细开关
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      dialogData: [], // Dialog 数据
      dialogDataAll: [], // 全部数据
      retrieval: "", // Dialog 检索内容
      examineBtn: ["全部", "个检", "团检"], //   全部 个检 团检
      examineBtnFlag: 0, //  全部 个检 团检 按钮的flag
      request: {
        page: 1,
        limit: 30,
        key: "",
        id: "",
        code: "",
        type: 0,
        tableName: "",
        businesstype: "",
        whereitems: [
          {
            key: "startdate",
            value: "",
          },
          {
            key: "enddate",
            value: "",
          },
        ],
      },
      dialogTabData: [], // dialog 点击个人团检 保存日期
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),

    //   首页列表表格配置项
    tableOptions() {
      return [
        {
          title: "体检组合",
          prop: "name",
          omit: 110,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleEditDicItem(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "科室",
          prop: "name",
          width: 100,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleEditDicItem(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
      ];
    },
    //   首页列表表格配置项
    dialogOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "体检号",
          prop: "regid",
          width: 120,
          omit: 1,
        },
        {
          title: "姓名",
          prop: "name",
          width: 120,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link type="primary" class="name_box">
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "性别",
          prop: "sex",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
          returnVal: (value) => {
            return value + "岁";
          },
        },
        {
          title: "手机号",
          prop: "telephone",
          width: 120,
          omit: 1,
        },
        {
          title: "身份证号",
          prop: "idcard",
          width: 180,
          omit: 1,
        },
        {
          title: "预约日期",
          prop: "checkdate",
          width: 160,
          omit: 1,
        },
        {
          title: "团检",
          prop: "companyname",
          width: 200,
          omit: 1,
        },
        {
          title: "批号",
          prop: "batch",
          omit: 1,
        },
        {
          title: "状态",
          prop: "statusname",
        },
      ];
    },
  },
  mounted() {
    // 页面加载获取预约时间列表数据
    this.handleGetData(this.getDate()[1]);
    this.getDate();
    this.Time();
    // this.getMonthDays() // 获取某月天数
  },
  watch: {},

  methods: {
    // Dialog 搜索回调
    retrievalFun() {
      console.log("Dialog 搜索回调", this.retrieval);
      // 找到名字相同的
      let result = [];
      this.retrieval &&
        (result = this.dialogData.filter((item) => item.name == this.retrieval.trim()));
      if (result != false) this.dialogData = result;
      else {
        this.$message.warning("请输入准确的姓名");
        this.retrieval = "";
        this.dialogData = this.dialogDataAll;
      }
    },
    // Dialog通知按钮回调
    notice() {
      console.log("通知按钮回调");
    },
    // Dialog里点击 全部 个检 团检,获取数据回调
    examineFun(index) {
      this.examineBtnFlag = index;
      if (index == "1") {
        const result = this.dialogDataAll.filter((item) => item.personalflag == 0);
        this.dialogData = result;
      } else if (index == "2") {
        const result = this.dialogDataAll.filter((item) => item.personalflag == 1);
        this.dialogData = result;
      } else {
        this.request.whereitems = this.dialogTabData;
        this.request.limit = 10000;
        AppointmentCustomerLoad(this.request).then((res) => {
          if (res.code == 200) {
            this.dialogData = res.result;
          }
        });
      }
    },
    // Dialog关闭回调
    DialogShutDown() {
      console.log("Dialog关闭回调");
      this.dialogTableVisible = false;
      this.retrieval = ""; // 清空输入框
      this.examineBtnFlag = 0; // 默认全部数据
    },
    // 点击Dialog内容回调
    DialogSelectIntment(data) {
      console.log("点击Dialog内容回调", data);
    },
    // 点击已约回调
    agreed(date) {
      console.log("点击已约回调", date);
      this.dialogTableVisible = true;
      this.dialogTabData = this.gettwodayDate(date);
      this.request.whereitems = this.gettwodayDate(date);
      this.request.limit = 10000;
      AppointmentCustomerLoad(this.request).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.dialogDataAll = res.result;
          this.dialogData = res.result;
        }
      });
    },
    // 检索方法
    searhFun() {
      console.log("检索", this.search);
    },
    // 获取数据
    handleGetData(date) {
      // console.log('获取数据', date);
      date && date[1] && (this.request.limit = date[1].value.split("-")[2]);
      date && date[1] && (this.request.whereitems = date);
      GetAppointmentTimeLoad(this.request).then((res) => {
        if (res.code == 200) {
          // console.log(res);
          this.calendarList = res.result?.dateitems || [];
          this.sortIndex = res.result?.sortindex;
        }
      });
    },
    // 点击月份回调
    SetDate(index) {
      this.monthFlag = index;
      this.handleGetData(this.getDate()[index]);
    },
    // 关闭
    ShutDown() {
      console.log("关闭当前页面");
      // 关闭当前页面回调
      if (this.visitedViews.length < 1) return false;
      let view = this.visitedViews.filter((k) => k.path === this.$route.path)[0];
      if (view) {
        // 设置删除vuex中tabs值
        if (view.path.split("/")[1]) {
          this.$store.commit("handlerSetTabRemove", view.path.split("/")[1]);
        }
        this.$store.dispatch("delVisitedViews", view).then((views) => {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("/");
          }
        });
      }
    },
    // 表格选中数据
    handleSelectIntment(item) {
      console.log("表格选中数据", item);
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
    // 点击左侧体检组合表格单项
    handleEditDicItem(item) {
      console.log("点击左侧体检组合表格单项", item);
    },
    // 获取月份
    getDate() {
      // 获取当前日期
      const currentDate = new Date();
      // 获取上个月的月份和最后一天日期
      const lastMonthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const lastMonth = lastMonthDate.getMonth();
      const last_start = this.Time(new Date(new Date().getFullYear(), lastMonth - 1, 1));
      const last_end = this.Time(new Date(new Date().getFullYear(), lastMonth, 0));
      // 获取本月的月份和最后一天日期
      const currentMonth = currentDate.getMonth() + 1;
      const current_start = this.Time(
        new Date(new Date().getFullYear(), currentMonth - 1, 1)
      );
      const current_end = this.Time(new Date(new Date().getFullYear(), currentMonth, 0));
      // 获取下个月的月份和最后一天日期
      const nextMonthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 2,
        1
      );
      const nextMonth = nextMonthDate.getMonth();
      const next_start = this.Time(new Date(new Date().getFullYear(), nextMonth - 1, 1));
      const next_end = this.Time(new Date(new Date().getFullYear(), nextMonth, 0));
      return {
        0: [
          {
            key: "startdate",
            value: last_start,
          },
          {
            key: "enddate",
            value: last_end,
          },
        ],
        1: [
          {
            key: "startdate",
            value: current_start,
          },
          {
            key: "enddate",
            value: current_end,
          },
        ],
        2: [
          {
            key: "startdate",
            value: next_start,
          },
          {
            key: "enddate",
            value: next_end,
          },
        ],
      };
    },
    //时间解析
    Time(now) {
      let year = new Date(now).getFullYear();
      let month = new Date(now).getMonth() + 1;
      let date = new Date(now).getDate();
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      return year + "-" + month + "-" + date;
    },
    //获得某月的天数：
    getMonthDays(myMonth) {
      let monthStartDate = new Date(new Date().getFullYear(), myMonth, 1);
      let monthEndDate = new Date(new Date().getFullYear(), myMonth + 1, 1);
      let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
      return days;
    },
    // 获取第二天的年月日
    gettwodayDate(date) {
      // 给定日期字符串
      const dateString = date;
      // 将日期字符串转换为日期对象
      const currentDate = new Date(dateString);
      // 获取给定日期的年、月、日
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // 月份从0开始，需要加1
      const day = currentDate.getDate();
      // 计算下一天的日期
      const nextDate = new Date(year, month - 1, day + 1); // 月份需要减1，日期加1
      // 获取下一天的年、月、日
      const nextYear = nextDate.getFullYear();
      const nextMonth = nextDate.getMonth() + 1; // 月份从0开始，需要加1
      const nextDay = nextDate.getDate();
      return [
        {
          key: "startdate",
          value: date,
        },
        {
          key: "enddate",
          value: `${nextYear}-${nextMonth}-${nextDay}`,
        },
      ];
    },
  },
};
</script>
<style scoped lang="scss">
// @import url("./css/index.scss");
.btnBox {
  display: flex;
  justify-content: space-between;
  padding-right: 5vw;
  background-color: white;
  width: 100% !important;
  margin-bottom: 10px;
  padding: 10px;

  .btnFlagClas {
    background-color: #0076c8 !important;
    color: white !important;
  }
}

.appointmentView {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 5px;

  .itemBox {
    width: 100%;
    margin: 0 auto;
  }

  .fontSize {
    font-size: 17px;
  }

  .btnFlagClas {
    background-color: #0076c8 !important;
    color: white !important;
  }

  .bodymain {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 10px;

    .searchBox {
      width: 20%;
      display: flex;
      line-height: 31px;
      margin: 10px 0 -20px 0;

      .span {
        display: inline-block;
        white-space: nowrap;
      }

      .input {
        width: 100%;
        height: 30px;
      }
    }

    /*  // 日历列表渲染 */
    .calendar_box {
      min-height: 635px;
      background-color: #fff;
      margin-bottom: 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;

      .dialogClas {
        .el-dialog {
          width: 77% !important;
          height: 70% !important;
        }

        .notice_shutDown {
          width: 15%;
          position: absolute;
          right: 0;
          top: 50px;
        }

        .handoff {
          display: flex;
          justify-content: space-between;
          height: 30px;

          .retrievalBox {
            display: flex;
            line-height: 30px;
            width: 24%;
          }
        }
      }

      .leftTable {
        width: 77%;
        height: 550px;
        overflow: auto;
        padding-top: 20px;
      }

      .head {
        font-size: 18px;
        font-weight: 600;
      }

      .weeks_box {
        display: flex;
        padding: 20px 0;

        > div {
          flex: 1;
          height: 40px;
          background-color: #409eff;
          box-shadow: 0 2px 2px rgba(10, 16, 20, 0.24), 0 0 2px rgba(10, 16, 20, 0.12);
          padding: 5px 0;
          margin-right: 10px;
          text-align: center;
          color: #fff;
          border-radius: 20px;
          line-height: 35px;
        }

        .mon {
          margin-left: 10px;
        }
      }

      /*  // 日历内容列表 */
      .calendar_list {
        max-width: 100%;
        overflow: auto;
        display: flex;
        flex-wrap: wrap;
        padding: 0 0px 0 12px;
        height: 73%;

        .empty_box {
          display: flex;
        }

        .empty {
          border: 0 none !important;
        }

        .calendar_item {
          width: 13%;
          margin: 10px 0.93% 10px 0.35%;

          .item_head {
            width: 99%;
            background-color: #63afe1;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-top-left-radius: 10px;
            /* 左上角 */
            border-top-right-radius: 10px;
            /* 右上角 */
            color: #fff;
            margin: 0;
          }

          .item_content {
            width: 99%;
            background-color: #fff;

            .type,
            .individual,
            .team {
              width: 100%;
              font-size: 14px;
              margin: 0 auto;
              text-align: center;

              .span {
                width: 33%;
                display: inline-block;
                background-color: #02a7f0;
                border: 1px solid #000;
                padding: 5px 5px;
                overflow: hidden;
                white-space: nowrap;
                margin-bottom: -6px;
              }
            }

            .content_item {
              width: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid #a6caae;
              font-size: 14px;
              white-space: nowrap;
              overflow: hidden;
            }

            .content_code {
              width: 50%;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid #a6caae;
              color: #78b1f3;
              white-space: nowrap;
            }
          }

          .item_content_select {
            border: 2px solid #409eff;
            background-color: #e6f1fa;
          }
        }
      }

      /*  // 手动高度 */
      .calendar_m {
        height: calc(100% - 132px);
      }

      /*   // 滚动条美化 */
      .calendar_list::-webkit-scrollbar {
        width: 8px;
      }

      .calendar_list::-webkit-scrollbar-track {
        background-color: transparent;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
      }

      .calendar_list::-webkit-scrollbar-thumb {
        background-color: #dddee0;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
      }
    }
  }
}

.table_appointment {
  height: 90% !important;
}

.el-dialog__body {
  height: 100% !important;
}
</style>
