<template>
  <div class="appointment">
    <!-- 头部操作控件 -->
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn moduleName="appointment" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
      </div>
    </sticky>
    <!-- 主体内容数据 -->
    <div class="subject">
      <el-row class="bg_white">
        <!-- 左侧检索条件内容 -->
        <el-col :span="5" class="search_box">
          <el-card class="box-card">
            <!-- 检索条件 -->
            <div class="condition">
              <!-- 头部标题 -->
              <div class="head">
                <div class="logo"></div>
                检索条件
              </div>
              <!-- 表单内容 -->
              <div class="condition_form" style="width: 100%;">
                <el-form ref="searchForm" :model="searchForm" label-width="90px">
                  <div class="date">
                    <!-- <el-button type="primary" size="mini">登记日期</el-button> -->
                    <el-popover ref="popoverRef" placement="bottom-start" trigger="click">
                      <div class="content">
                        <div class="content_item" v-for="item in checkupDateArr" :key="item.code" @click="handleSelectConditionDate(item)">
                          {{ item.name }}
                        </div>
                      </div>
                      <el-button type="primary" plain style="width: 80px" size="mini" slot="reference">{{ dateName }}</el-button>
                    </el-popover>
                    <el-date-picker size="mini" style="width: 100%;" @change="handleChangeSearchDate" v-model="searchDate" type="daterange" range-separator="-" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </div>
                  <div class="checkno mt">
                    <!-- <div>
                      <el-button type="primary" size="mini">体检号</el-button>
                    </div> -->
                    <el-popover ref="popoverRef" placement="bottom-start" trigger="click">
                      <div class="content">
                        <div class="content_item" v-for="item in checkupCodeArr" :key="item.code" @click="handleSelectCondition(item)">
                          {{ item.name }}
                        </div>
                      </div>
                      <el-button type="primary" plain style="padding: 7px 4px; margin-right: 5px" size="mini" slot="reference">{{ condition }}</el-button>
                    </el-popover>
                    <el-input v-model="conditionKeyword" @clear="handleSearchFormSubmit" @keyup.native.enter="handleSearchFormSubmit" clearable size="mini"></el-input>
                  </div>
                  <!-- <div class="persontype mt">
                    <el-button type="primary" size="mini" @click="
                        (searchForm.persontype = ''),
                          (currentPage = 1),
                          handleSearchFormSubmit()
                      ">全部</el-button>
                    <el-button type="primary" size="mini" @click="
                        (searchForm.persontype = '0'),
                          (currentPage = 1),
                          handleSearchFormSubmit()
                      ">个人</el-button>
                    <el-button type="primary" size="mini" @click="
                        (searchForm.persontype = '1'),
                          (currentPage = 1),
                          handleSearchFormSubmit()
                      ">单位</el-button>
                  </div>
                  <div class="status mt">
                    <el-button type="primary" size="mini" @click="
                        (searchForm.status = ''),
                          (currentPage = 1),
                          handleSearchFormSubmit()
                      ">全部</el-button>
                    <el-button type="primary" size="mini" @click="
                        (searchForm.status = 0),
                          (currentPage = 1),
                          handleSearchFormSubmit()
                      ">未预约</el-button>
                    <el-button type="primary" size="mini" @click="
                        (searchForm.status = 1),
                          (currentPage = 1),
                          handleSearchFormSubmit()
                      ">已预约</el-button>
                  </div> -->
                  <el-form-item class="mt" label="类型" size="mini">
                    <el-radio-group v-model="searchForm.persontype" size="small" @change="(currentPage = 1),handleSearchFormSubmit()">
                      <el-radio-button :label="''">全部</el-radio-button>
                      <el-radio-button :label="0">个人</el-radio-button>
                      <el-radio-button :label="1">单位</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item class="mt" label="预约状态" size="mini" @change="(currentPage = 1),handleSearchFormSubmit()">
                    <el-radio-group v-model="searchForm.status" size="small">
                      <el-radio-button :label="''">全部</el-radio-button>
                      <el-radio-button :label="0">未预约</el-radio-button>
                      <el-radio-button :label="1">已预约</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item class="mt" label="是否报道" size="mini" @change="(currentPage = 1),handleSearchFormSubmit()">
                    <el-radio-group v-model="searchForm.reportStatus" size="small">
                      <el-radio-button :label="''">全部</el-radio-button>
                      <el-radio-button :label="0">未报道</el-radio-button>
                      <el-radio-button :label="1">已报道</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item class="mt" label="姓名" size="mini">
                    <el-input v-model="searchForm.name" @clear="handleSearchFormSubmit" clearable @keyup.native.enter="handleSearchFormSubmit"></el-input>
                  </el-form-item>
                  <el-form-item class="mt" label="身份证" size="mini">
                    <el-input v-model="searchForm.idcard" @clear="handleSearchFormSubmit" clearable @keyup.native.enter="handleSearchFormSubmit"></el-input>
                  </el-form-item>
                  <el-form-item class="mt" label="电话" size="mini">
                    <el-input v-model="searchForm.telephone" @clear="handleSearchFormSubmit" clearable @keyup.native.enter="handleSearchFormSubmit"></el-input>
                  </el-form-item>
                  <el-form-item class="mt" label="团检名称" size="mini">
                    <el-select @change="handleChangeCompany" filterable clearable v-model="searchForm.companycode">
                      <el-option v-for="item in companyArr" :key="item.companycode" :label="`${item.companycode}　${item.companyname}`" :value="item.companycode"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="mt" label="批次" size="mini">
                    <el-select filterable clearable v-model="searchForm.batch">
                      <el-option v-for="item in batchitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="mt" label="分组" size="mini">
                    <el-select filterable clearable v-model="searchForm.groupcode">
                      <el-option v-for="item in groupitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="mt" label="客户级别" size="mini">
                    <el-select style="width: 100%" v-model="searchForm.level" clearable placeholder="" @change="handleSearchFormSubmit">
                      <el-option label="普通" :value="0"></el-option>
                      <el-option label="VIP" :value="1"></el-option>
                      <el-option label="保密" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="mt" label="性别" size="mini">
                    <el-select style="width: 100%" v-model="searchForm.sex" clearable placeholder="" @change="handleSearchFormSubmit">
                      <el-option label="全部" :value="0"></el-option>
                      <el-option label="男" :value="1"></el-option>
                      <el-option label="女" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="mt tj" label="今日预约总数:" label-width="160px" size="mini">
                    {{ reportCount.length>0?reportCount[0]:0 }}
                  </el-form-item>
                  <el-form-item class="mt tj" label="今日已报道总数:" label-width="160px" size="mini">
                    {{ reportCount.length>0?reportCount[1]:0 }}
                  </el-form-item>
                  <el-form-item class="mt tj" label="今日未报道总数:" label-width="160px" size="mini">
                    {{ reportCount.length>0?reportCount[2]:0 }}
                  </el-form-item>
                  <!-- <div class="btn_submit">
                    <el-button type="primary" size="mini" @click="handleSearchFormSubmit">搜索</el-button>
                  </div>
                  </div> -->
                </el-form>
              </div>
            </div>
            <!-- 预约日历 -->
            <!--<div class="calendar">
               头部标题 
               <div class="head">预约日历</div> 
               日历 
            </div>-->
          </el-card>
        </el-col>
        <!-- 右侧表格数据 -->
        <el-col :span="19" class="data_box">
          <EasyTable :loading="loading" height="100%" class="table_appointment" :data="appointment" ref="combineone" :tableOptions="tableOptions" :checkbox-config="{ fetch: true, rowClick: true }" @selection-change="handleSelectIntment" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300,500,1000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <!-- 签到流程 -->
    <FlowPath v-if="showFlowPath" :regid="flowPathRegid" @close="handleCloseFlowPath" />
    <!-- 预约日历 -->
    <Calendar v-if="showCalendar" :makeNumber="calendarFlag == 'radio' ? 1 : chooseList.length" :makeFlag="makeFlag" @submit="handleSaveAppointment" @close="handleCloseCalendar" />
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import FlowPath from "@/components/flowPath"; // 签到流程组件
import Calendar from "@/components/calendar"; // 预约日历组件
import { getSysConfigInfo } from "@/api/sysconfig";
import { mapGetters } from "vuex";

import {
  getCompanyList,
  getSearchParams,
  getIntmentList,
  getIntmentListNew,
  CurrentAppointAndReportCount,
  setAppointmentSave,
  setAppointmentCancel,
  setAppointmentAlter,
} from "@/api/appointment.js";
export default {
  name: "appointment",

  components: { Sticky, permissionBtn, FlowPath, Calendar },

  data() {
    return {
      showCalendar: false, // 控制显示预约日历
      makeFlag: "", // 日历预约标识  手动/manual 自动/auto
      showFlowPath: false, // 控制显示登记流程
      flowPathRegid: "", // 登记流程查询ID
      choosePeople: undefined, // 当前选中编辑人员
      chooseCalendar: undefined, // 当前选中编辑人员
      calendarFlag: "", // radio select
      chooseList: [], // 当前多选选中人员
      appointment: [], //个人预约列表数据
      searchForm: {
        date: "",
        checkno: "",
        regid: "",
        name: "",
        companycode: "",
        groupcode: "",
        batch: "",
        persontype: "",
        status: "",
        startdate: "",
        enddate: "",
        telephone: "",
        idcard: "",
        hiscode: "",
        timetype: 4,
        sex: 0,
        reportStatus: "",
        level: "",
      }, // 检索表单
      loading: false, //表格加载效果
      companyArr: [], // 单位下拉数据
      companycode: "", // 单位选中编号数据
      batchitems: [], // 批次号下拉数据
      groupitems: [], // 批次号下拉数据
      searchDate: [],
      currentPage: 1,
      pageSize: 100,
      count: 0,
      changeFlag: false,
      changeData: undefined,
      checkupDateArr: [
        { code: "regdate", name: "登记日期" },
        { code: "reservationdate", name: "预约时间" },
      ],
      dateCode: "reservationdate",
      dateName: "预约时间",
      condition: "体检号", //检索体检条件
      conditionCode: "regid",
      conditionKeyword: "",
      checkupCodeArr: [
        { code: "regid", name: "体检号" },
        { code: "hiscode", name: "门诊卡号" },
      ], // 检索条件身份证等数组
      reportCount: [],
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),

    //   首页列表表格配置项
    tableOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          type: "index",
          title: "序号",
          width: 55,
          fixed: "left",
        },
        {
          title: "姓名",
          prop: "name",
          fixed: "left",
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
          title: "体检号",
          prop: "regid",
          width: 120,
          omit: 1,
        },
        {
          title: "身份证",
          prop: "idcard",
          width: 180,
          omit: 1,
        },
        {
          title: "手机号",
          prop: "telephone",
          width: 140,
          omit: 1,
        },
        {
          title: "客户级别",
          prop: "level",
          width: 140,
          omit: 1,
          returnVal: (value) => {
            return value == 0
              ? "普通"
              : value == 1
              ? "VIP"
              : value == 2
              ? "保密"
              : "";
          },
        },
        {
          title: "体检性质",
          prop: "personalflag",
          width: 140,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "个人" : "团体";
          },
        },
        // {
        //   title: "体检类型",
        //   prop: "checktypename",
        //   width: 140,
        //   omit: 1,
        // },
        {
          title: "单位名称",
          prop: "companyname",
          width: 250,
          omit: 1,
        },
        {
          title: "是否预约",
          prop: "registerStatus",
          width: 100,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "未预约" : "预约";
          },
        },
        {
          title: "预约时段",
          prop: "registerdate",
          width: 160,
          omit: 1,
        },
        {
          title: "操作时间",
          prop: "operatordate",
          width: 160,
          omit: 1,
        },
        {
          title: "是否报道",
          prop: "reportStatus",
          width: 100,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "未报道" : "已报道";
          },
        },
        {
          title: "科外检查项目",
          prop: "combinenames",
          width: 250,
          omit: 1,
        },
        {
          title: "登记日期",
          prop: "regdate",
          width: 120,
          omit: 1,
        },
        {
          title: "状态",
          prop: "status",
          enumType: [
            {
              value: 0,
              label: "已登记",
            },
            {
              value: 1,
              label: "已预约",
            },
            {
              value: 2,
              label: "已签到",
            },
            {
              value: 3,
              label: "体检中",
            },
            {
              value: 4,
              label: "已交表",
            },
            {
              value: 5,
              label: "可总检",
            },
            {
              value: 6,
              label: "已总检",
            },
            {
              value: 7,
              label: "已审核",
            },
          ],
        },
        {
          title: "操作",
          width: 200,
          omit: 1,
          render: (h, data) => {
            return (
              <div style="width:100%;display: flex;justify-content: space-around;">
                <el-button
                  type="primary"
                  size="mini"
                  disabled={data.status != 0}
                  vOn:click_stop_prevent={() => {
                    this.calendarFlag = "radio";
                    this.handleShowCalendar(data);
                  }}
                >
                  预约
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  disabled={data.status != 1}
                  vOn:click_stop_prevent={() => {
                    this.calendarFlag = "radio";
                    this.handleChangeCalendar(data);
                  }}
                >
                  修改
                </el-button>
                <el-button
                  type="success"
                  size="mini"
                  disabled={![1, 2].includes(data.status)}
                  vOn:click_stop_prevent={() => {
                    this.calendarFlag = "radio";
                    this.handleSetAppointmentCancel(data);
                  }}
                >
                  取消
                </el-button>
              </div>
            );
          },
        },
      ];
    },
  },
  mounted() {
    // 页面加载获取列表数据
    this.handleGetCompanyList();
    this.handleGetRegisterDate(); // 设置默认日期
  },

  methods: {
    // 统计数据接口
    handleCurrentAppointAndReportCount() {
      CurrentAppointAndReportCount().then((res) => {
        if (!res.result) return;
        this.reportCount = res.result;
      });
    },
    // 点击选择检索体检条件回调
    handleSelectCondition(val) {
      this.condition = val.name;
      this.conditionCode = val.code;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    // 点击选择检索体检条件回调
    handleSelectConditionDate(val) {
      this.dateName = val.name;
      this.dateCode = val.code;
      val.code == "regdate"
        ? (this.searchForm.timetype = 0)
        : (this.searchForm.timetype = 4);
      this.handleSearchFormSubmit();
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    // 关闭当前页面回调
    handleClosePage() {
      if (this.visitedViews.length < 1) return false;
      let view = this.visitedViews.filter(
        (k) => k.path === this.$route.path
      )[0];
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
    // 当前改变每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleGetIntmentList();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleGetIntmentList();
    },
    // 选择时间触发回调
    handleChangeSearchDate(value) {
      if (value) {
        this.searchForm.startdate = value[0];
        this.searchForm.enddate = value[1];
      } else {
        this.searchForm.startdate = "";
        this.searchForm.enddate = "";
      }
    },
    //   检索条件提交表单回调
    handleSearchFormSubmit() {
      this.handleGetIntmentList();
    },
    // 获取单位列表回调
    handleGetCompanyList() {
      getCompanyList().then((res) => {
        this.companyArr = res.data;
      });
    },
    // 切换公司单位下拉列表触发回调
    handleChangeCompany(val) {
      this.companycode = val;
      if (val) {
        this.companycode = val;
        // 请求搜索条件集数据]
        this.handleGetSearchParams();
      } else {
        this.searchForm.batch = "";
        this.handleGetIntmentList();
      }
    },
    // 搜索组件条件集数据回调
    handleGetSearchParams() {
      getSearchParams({ companycode: this.companycode }).then((res) => {
        this.batchitems = res.result.batchitems;
        let select = this.batchitems.filter((k) => k.selected)[0];
        if (select) {
          this.searchForm.batch = select.code;
          this.groupitems = select.groupitems;
        }
        this.handleGetIntmentList();
      });
    },
    // 获取个人预约列表数据回调
    handleGetIntmentList() {
      let whereitems = [];
      Object.keys(this.searchForm).forEach((k) => {
        if (this.searchForm[k] !== "") {
          whereitems.push({
            key: k,
            value: this.searchForm[k],
          });
        }
      });
      if (this.conditionKeyword) {
        whereitems.push({
          key: this.conditionCode,
          value: this.conditionKeyword,
        });
      }
      getIntmentListNew({
        whereitems,
        page: this.currentPage,
        limit: this.pageSize,
      }).then((res) => {
        this.count = res.count;
        this.appointment = res.data;
        this.searchForm.regid = "";
      });
      this.searchForm.regid = "";
    },
    // 列表多选选中值回调
    handleSelectIntment(rows) {
      this.chooseList = Object.assign([], rows);
    },
    // 登记日期设置默认值回调
    handleGetRegisterDate() {
      getSysConfigInfo({ cc: "Sys_CustomerRegister_CheckDateRange" }).then(
        (res) => {
          // 获取条件计算日期范围回调
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
          this.searchDate = [this.gettime(start), this.gettime(end)];
          this.searchForm.startdate = this.gettime(start);
          this.searchForm.enddate = this.gettime(end);
          // this.handleGetIntmentList();
        }
      );
    },
    gettime(data) {
      let value =
        data.getFullYear() +
        "-" +
        this.checkTime(data.getMonth() + 1) +
        "-" +
        this.checkTime(data.getDate());
      return value;
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    // 控制显示登记流程
    handleCloseFlowPath(val) {
      this.showFlowPath = val;
    },
    // 控制显示登记流程
    handleShowFlowPath() {
      // 必须勾选人员 限制人员个数
      if (this.chooseList.length == 0) {
        this.$message.warning("请先选中需要查询流程人员!");
        return false;
      } else if (this.chooseList.length > 1) {
        this.$message.warning("只能查询单个人员流程!");
        return false;
      }
      this.choosePeople = this.chooseList[0];
      if (!this.choosePeople) {
        this.$message.warning("请先选择查看人员!");
        return false;
      }
      this.flowPathRegid = this.choosePeople.regid;
      this.showFlowPath = true;
    },
    // 取消预约回调
    handleSetAppointmentCancel(data) {
      let flag = true;
      if (this.calendarFlag === "radio") {
        if (data.status !== 1) {
          this.$message.warning("当前状态不允许取消预约!");
          return false;
        }
        setAppointmentCancel([data.regid]).then((res) => {
          this.$message.success(res.message);
          this.handleGetIntmentList();
        });
      } else {
        this.chooseList.forEach((k) => {
          if (k.status !== 1) {
            this.$message.warning(`${k.name} 当前状态不允许取消预约!`);
            flag = false;
          }
        });
        if (!flag) return false;
        let ids = this.chooseList.map((k) => {
          return k.regid;
        });
        setAppointmentCancel(ids).then((res) => {
          this.$message.success(res.message);
          this.handleGetIntmentList();
        });
      }
      this.handleGetIntmentList();
    },
    // 修改预约信息
    handleChangeCalendar(data) {
      if (!data) return false;
      if (data.status !== 1) {
        this.$message.warning("当前状态不允许取消预约!");
        return false;
      }
      this.changeFlag = true;
      this.changeData = JSON.parse(JSON.stringify(data));
      this.chooseCalendar = JSON.parse(JSON.stringify(data));
      this.showCalendar = true;
      // 取消预约
      // setAppointmentCancel([data.regid]).then((res) => {
      //   this.$message.success(res.message);
      //   this.handleGetIntmentList();
      //   this.calendarFlag === "radio";
      //   this.chooseCalendar = data;
      //   this.showCalendar = true;
      // });
    },
    // 控制显示预约日历
    handleShowCalendar(data) {
      if (data) {
        this.chooseCalendar = data;
        this.showCalendar = true;
        return false;
      }
      if (this.chooseList.length == 0) {
        this.$message.warning("请先勾选所需预约人员!");
        return false;
      }
      let tips = "";
      this.chooseList.forEach((k) => {
        if (k.status != 0) {
          tips += `${k.name}、`;
        }
      });
      if (tips) {
        this.$message.warning(`${tips}当前状态不可预约!`);
        return false;
      }
      if (this.chooseList.length > 0) {
        this.showCalendar = true;
        return false;
      }
    },
    // 日历组件提交回调
    handleSaveAppointment(item) {
      let data = undefined;
      if (this.calendarFlag === "radio") {
        data = {
          regiditems: [this.chooseCalendar.regid],
          checknoitems: [this.chooseCalendar.checkno],
          selectdate: item.selectdate,
          timeid: item.timeid,
        };
      } else {
        data = {
          regiditems: this.chooseList.map((k) => {
            return k.regid;
          }),
          checknoitems: this.chooseList.map((k) => {
            return k.checkno;
          }),
          selectdate: item.selectdate,
          timeid: item.timeid,
        };
      }
      setAppointmentAlter(data).then((res) => {
        this.$message.success(res.message);
        this.handleGetIntmentList();
      });
      this.makeFlag = "";
      this.showCalendar = false;
    },
    // // 日历组件提交回调
    // handleSaveAppointment(item) {
    //   if (this.changeFlag) {
    //     // 取消预约
    //     setAppointmentCancel([this.changeData.regid]).then((res) => {
    //       this.calendarFlag = "radio";
    //       let data = undefined;
    //       if (this.calendarFlag === "radio") {
    //         data = {
    //           regiditems: [this.chooseCalendar.regid],
    //           checknoitems: [this.chooseCalendar.checkno],
    //           selectdate: item.selectdate,
    //           timeid: item.timeid,
    //         };
    //       } else {
    //         data = {
    //           regiditems: this.chooseList.map((k) => {
    //             return k.regid;
    //           }),
    //           checknoitems: this.chooseList.map((k) => {
    //             return k.checkno;
    //           }),
    //           selectdate: item.selectdate,
    //           timeid: item.timeid,
    //         };
    //       }
    //       setAppointmentSave(data).then((res) => {
    //         this.$message.success(res.message);
    //         this.handleGetIntmentList();
    //       });
    //       this.makeFlag = "";
    //       this.showCalendar = false;
    //     });
    //   } else {
    //     let data = undefined;
    //     if (this.calendarFlag === "radio") {
    //       data = {
    //         regiditems: [this.chooseCalendar.regid],
    //         checknoitems: [this.chooseCalendar.checkno],
    //         selectdate: item.selectdate,
    //         timeid: item.timeid,
    //       };
    //     } else {
    //       data = {
    //         regiditems: this.chooseList.map((k) => {
    //           return k.regid;
    //         }),
    //         checknoitems: this.chooseList.map((k) => {
    //           return k.checkno;
    //         }),
    //         selectdate: item.selectdate,
    //         timeid: item.timeid,
    //       };
    //     }
    //     setAppointmentSave(data).then((res) => {
    //       this.$message.success(res.message);
    //       this.handleGetIntmentList();
    //     });
    //     this.makeFlag = "";
    //     this.showCalendar = false;
    //   }
    // },
    // 关闭日历组件回调
    handleCloseCalendar() {
      this.makeFlag = "";
      this.showCalendar = false;
    },
    // 列表下载
    downloadExcel() {
      if (this.chooseList.length == 0) {
        this.$message.warning("请选择需要导出的信息!");
        return false;
      }
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.excelData = this.chooseList.map((k) => {
            return {
              ...k,
              sex: k.sex == 0 ? "未知" : k.sex == 1 ? "男" : "女",
              levelcn: k.level == 0 ? "普通" : k.sex == 1 ? "VIP" : "保密",
              personalflagcn: k.personalflag == 0 ? "个人" : "团体",
              registerStatuscn: k.registerStatus == 0 ? "未预约" : "预约",
              reportStatuscn: k.reportStatus == 0 ? "未报道" : "已报道",
            };
          });
          this.export2Excel();
        })
        .catch(() => {});
    },
    // 数据写入excel
    export2Excel() {
      var that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/vendor/Export2Excel"); // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
        const tHeader = [
          "姓名",
          "性别",
          "年龄",
          "体检号",
          "身份证",
          "手机号",
          "客户级别",
          "体检性质",
          "单位名称",
          "是否预约",
          "预约时段",
          "操作时间",
          "是否报道",
          "科外检查项目",
          "登记日期",
          "状态",
        ]; // 导出的表头名信息
        const filterVal = [
          "name",
          "sex",
          "age",
          "regid",
          "idcard",
          "telephone",
          "levelcn",
          "personalflagcn",
          "companyname",
          "registerStatuscn",
          "registerdate",
          "operatordate",
          "reportStatuscn",
          "combinenames",
          "regdate",
          "statusname",
        ]; // 导出的表头字段名，需要导出表格字段名
        const list = this.excelData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "导出数据"); // 导出的表格名称，根据需要自己命名
      });
    },
    // 格式转换，直接复制即可
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
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
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnSearch": // 查询
          console.log("点击了 查询");
          this.handleSearchFormSubmit(); // 列表
          this.handleCurrentAppointAndReportCount(); // 统计
          break;
        case "btnAuto": // 自动预约
          this.calendarFlag = "select";
          this.handleShowCalendar();
          break;
        case "btnBatch": // 批量取消
          this.calendarFlag = "select";
          this.handleSetAppointmentCancel();
          break;
        case "btnPrint": // 打印
          console.log("点击了 打印");
          break;
        case "btnExport1": // 导出
          this.downloadExcel();
          break;
        case "btnFlowPath": // 流程
          this.handleShowFlowPath();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
  },

  watch: {},
};
</script>
<style lang='scss' scoped>
@import "./css/index_gdgy.scss";
.el-popover {
  .content {
    .content_item {
      height: 20px;
      margin-bottom: 3px;
      padding: 0 10px;
      cursor: pointer;
    }
    .content_item:hover {
      color: #66b1ff;
      background-color: #ecf5ff;
    }
  }
  .print_item {
    margin-bottom: 3px;
    padding: 5px 10px;
    cursor: pointer;
  }
  .print_item:hover {
    background-color: #ecf5ff;
    color: #66b1ff;
  }
}
</style>