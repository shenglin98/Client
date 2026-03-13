<template>
  <div class="client_review">
    <!-- 头部筛选盒子 -->
    <div class="head_box">
      <div class="title_box">
        <div class="title">检索条件</div>
        <!-- 头部操作控件 -->
        <sticky class="btn_group" :className="'sub-navbar'">
          <div class="filter-container">
            <permission-btn
              moduleName="customerResult"
              size="mini"
              v-on:btn-event="hadnleOnBtnClicked"
            >
            </permission-btn>
          </div>
        </sticky>
      </div>
      <el-form
        ref="form"
        class="search_form"
        :model="searchForm"
        label-width="80px"
      >
        <el-form-item size="mini" label="随访日期">
          <el-date-picker
            style="width: 240px"
            v-model="searchDate"
            unlink-panels
            @change="handleChangeSearchDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item size="mini" label="体检中心">
          <el-select
            v-model="searchForm.meccode"
            clearable
            filterable
            @change="handleChangeMeccode"
          >
            <el-option
              v-for="item in meccodeitems"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="体检号">
          <el-input
            v-model="searchForm.regid"
            @keyup.native.enter="handleGetLoadTrack"
            @clear="handleGetLoadTrack"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item size="mini" label="姓名">
          <el-input
            v-model="searchForm.name"
            @keyup.native.enter="handleGetLoadTrack"
            @clear="handleGetLoadTrack"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item size="mini" label="级别">
          <el-select
            style="width: 100%"
            v-model="searchForm.level"
            placeholder=""
          >
            <el-option label="普通" :value="0"></el-option>
            <el-option label="VIP" :value="1"></el-option>
            <el-option label="保密" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="体检时间>" class="regday">
          <el-input
            v-model="searchForm.regday"
            @keyup.native.enter="handleGetLoadTrack"
            @clear="handleGetLoadTrack"
            clearable
          >
          </el-input>
          天
        </el-form-item>
      </el-form>
    </div>
    <!-- 主体内容 -->
    <div class="subject">
      <!-- 主体左侧表格 -->
      <div class="s_left">
        <el-radio-group
          @change="handleGetLoadTrack"
          v-model="searchForm.status"
          size="mini"
        >
          <el-radio-button :label="''">全部</el-radio-button>
          <el-radio-button :label="'1'">待随访</el-radio-button>
          <el-radio-button :label="'2'">已随访</el-radio-button>
          <el-radio-button :label="'3'">我随访</el-radio-button>
        </el-radio-group>
        <EasyTable
          height="100%"
          :data="staffData"
          class="staff_table"
          :tableOptions="staffOptions"
          :checkbox-config="{ fetch: true, rowClick: true }"
          @selected-change="handleSelectStaff"
          :border="false"
          :header-cell-style="handleReturnStyle"
          :row-class-name="handleTableRowClassName"
          :row-style="{ height: '32px' }"
          :cell-style="{ padding: '0' }"
        />
      </div>
      <!-- 随访详情弹框 -->
      <el-dialog
        title="随访详情"
        class="track_dialog"
        :visible.sync="dialogVisible"
        width="80%"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div class="s_right">
          <div class="r_top">
            <div class="title">基本信息</div>
            <el-form
              ref="form"
              class="info_form"
              :model="infoForm"
              disabled
              label-width="80px"
            >
              <el-form-item size="mini" label="体检号">
                <el-input v-model="chooseStaff.regid"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="姓名">
                <el-input v-model="chooseStaff.name"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="性别">
                <el-input v-model="chooseStaffSex"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="年龄">
                <el-input v-model="chooseStaff.age"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="婚姻">
                <el-input v-model="chooseStaff.marriage"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="身份证">
                <el-input v-model="chooseStaff.idcard"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="联系电话">
                <el-input v-model="chooseStaff.telephone"></el-input>
              </el-form-item>
              <!-- <el-form-item size="mini" label="体检时间">
                <el-input v-model="chooseStaff.checkdate"></el-input>
              </el-form-item> -->
            </el-form>
          </div>
          <div class="r_body">
            <!-- 左侧疾病列表 -->
            <div class="table_box">
              <el-radio-group v-model="reviewStatus" size="mini">
                <el-radio-button :label="0">随访内容</el-radio-button>
                <el-radio-button :label="1">随访记录</el-radio-button>
                <el-radio-button :label="2">科室检查</el-radio-button>
                <el-radio-button :label="3">总结</el-radio-button>
              </el-radio-group>
              <EasyTable
                height="100%"
                :data="chooseRecord.trackdetaiiItems"
                class="illness_table"
                :tableOptions="illnessOptions"
                :radio-config="{ fetch: true, rowClick: true }"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :row-style="{ height: '32px' }"
                :cell-style="{ padding: '0' }"
              />
              <div class="table_title">随访内容</div>
              <el-input
                class="review_content"
                type="textarea"
                resize="none"
                v-model="chooseRecord.trackcontent"
              ></el-input>
            </div>
            <!-- 右侧随访记录 -->
            <div class="form_box">
              <div class="from_head">
                <div class="text">随访记录</div>
                <div class="btn_group">
                  <el-button size="mini" type="primary">常用模板</el-button>
                  <el-button size="mini" type="primary">保存模板</el-button>
                </div>
              </div>
              <EasyTable
                height="100%"
                :data="recordData"
                class="review_record"
                :tableOptions="recordOptions"
                :radio-config="{ fetch: true, rowClick: true }"
                @row-click="handleSelectRecord"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :row-style="{ height: '32px' }"
                :cell-style="{ padding: '0' }"
              />
              <el-form
                ref="form"
                class="review_form"
                :model="reviewForm"
                label-width="80px"
              >
                <el-form-item size="mini" label="随访方式">
                  <!-- <el-select v-model="reviewForm.region">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select> -->
                  <el-input v-model="chooseRecord.tracktype"></el-input>
                </el-form-item>
                <el-form-item size="mini" label="随访结果">
                  <el-input v-model="chooseRecord.trackresult"></el-input>
                </el-form-item>
                <el-form-item size="mini" label="随访对象">
                  <el-input v-model="chooseRecord.trackobject"></el-input>
                </el-form-item>
                <el-form-item size="mini" label="随访时间">
                  <el-input v-model="chooseRecord.trackdate"></el-input>
                </el-form-item>
                <el-form-item size="mini" label="随访医生">
                  <el-input v-model="chooseRecord.doctorname"></el-input>
                </el-form-item>
                <el-form-item size="mini" label="记录时间">
                  <el-input v-model="chooseRecord.inputdate"></el-input>
                </el-form-item>
              </el-form>
              <!-- 操作按钮 -->
              <div class="page_btn">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleSetCompleteTrack"
                  >结束随访</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="handleSetAgainTrack"
                  >继续随访</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="handleCloseAgainTrack"
                  >关闭</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import * as reportstatics from "@/api/reportstatics";
import { mapGetters } from "vuex";

import {
  getLoadTrack,
  getTrackDetail,
  setAgainTrack,
  setCompleteTrack,
} from "@/api/clientreview.js";
export default {
  name: "clientreview",

  components: {
    Sticky,
    permissionBtn,
  },

  data() {
    return {
      test: "",
      dialogVisible: false,
      searchForm: {
        level: "",
        regday: "",
        startdate: "",
        enddate: "",
        meccode: "",
        checkno: "",
        name: "",
        status: "",
      }, // 筛选表单对象
      chooseStaff: {}, //当前选中人员
      choossePeople: [], //当前选中人员列表
      searchDate: [], // 筛选表单时间
      infoForm: {}, // 基本信息表单对象
      status: 0, // 当前随访人员列表操作状态
      reviewStatus: 0, // 当前随访操作状态
      reviewForm: {}, // 随访信息表单对象
      staffData: [], // 人员列表数据
      illnessData: [], // 疾病列表数据
      recordData: [], // 随访记录数据
      chooseRecord: {}, // 随访记录选中数据
      trackdetaiiItems: [], // 追踪明细集数组
      meccodeitems: [],
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),

    // 当前选中人员性别
    chooseStaffSex() {
      if (this.chooseStaff.sex !== undefined) {
        let value = this.chooseStaff.sex;
        return value == 0 ? "未知" : value == 1 ? "男" : "女";
      } else {
        return "";
      }
    },
    //   人员列表表格配置
    staffOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "姓名",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => {
                  this.hadnleShowTrackDetails(data);
                }}
              >
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
            return `${value}岁`;
          },
        },
        {
          title: "体检号",
          width: 110,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => {
                  this.hadnleShowTrackDetails(data);
                }}
              >
                {data.regid}
              </el-link>
            );
          },
        },
        {
          title: "身份证",
          prop: "idcard",
          width: 170,
          omit: 1,
        },
        {
          title: "联系电话",
          prop: "telephone",
          width: 110,
          omit: 1,
        },
        {
          title: "单位",
          prop: "companyname",
          width: 230,
          omit: 1,
        },
        // {
        //   title: "部门",
        //   prop: "department",
        //   width: 110,
        //   omit: 1,
        // },
        {
          title: "状态",
          prop: "trackstatuscn",
          width: 110,
          omit: 1,
        },
        {
          title: "异常结果",
          prop: "wordname",
          width: 110,
          omit: 1,
        },
        {
          title: "优先级",
          prop: "wordlevel",
          width: 110,
          omit: 1,
        },
        {
          title: "随访医生",
          prop: "doctorname",
          width: 110,
          omit: 1,
        },
        {
          title: "随访时间",
          prop: "checkdate",
          width: 150,
          omit: 1,
        },
        {
          title: "随访说明",
          prop: "explain",
          width: 110,
          omit: 1,
        },
        {
          title: "下次随访",
          prop: "nexttrackdate",
          width: 150,
          omit: 1,
        },
        // {
        //   title: "档案号",
        //   prop: "checkno",
        //   width: 110,
        //   omit: 1,
        // },
        // {
        //   title: "体检号",
        //   prop: "regid",
        //   width: 110,
        //   omit: 1,
        // },
      ];
    },
    //   疾病列表表格配置
    illnessOptions() {
      return [
        {
          title: "异常情况",
          prop: "wordname",
        },
        {
          title: "预订时间",
          prop: "reminddate",
        },
        {
          title: "续访",
          width: 50,
          render: (h, data) => {
            return (
              <el-checkbox
                v-model={data.checked}
                onChange={() => this.handleChangeReturnVisit(data)}
              ></el-checkbox>
            );
          },
        },
      ];
    },
    // 随访记录表格配置
    recordOptions() {
      return [
        {
          title: "说明",
          prop: "explain",
          omit: 1,
        },
        {
          title: "随访时间",
          prop: "trackdate",
          omit: 1,
        },
      ];
    },
  },
  mounted() {
    reportstatics.LoadSearchInfo().then((response) => {
      if (
        response.result != undefined &&
        response.result != null &&
        response.result != ""
      ) {
        this.meccodeitems = response.result.meccodeitems;
      }
      console.log(response);
    });
  },

  methods: {
    hadnleShowTrackDetails(item) {
      if (!item) return;
      this.chooseStaff = item;
      getTrackDetail({ regid: this.chooseStaff.regid }).then((res) => {
        this.recordData = res.result;
        this.dialogVisible = true;
      });
    },
    handleCloseAgainTrack() {
      this.dialogVisible = false;
    },
    handleChangeMeccode(val) {
      val && this.handleGetLoadTrack();
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
    // 结束追踪回调
    handleSetCompleteTrack() {
      if (!this.chooseRecord.regid) {
        this.$message.warning("请先勾选需结束追踪数据!");
        return false;
      }
      setCompleteTrack(this.chooseRecord).then((res) => {
        this.$message.success(res.message);
        this.handleGetTrackDetail();
      });
    },
    // 继续追踪接口回调
    handleSetAgainTrack() {
      if (!this.chooseRecord.regid) {
        this.$message.warning("请先勾选需继续追踪数据!");
        return false;
      }
      let trackdetaiiItems = this.trackdetaiiItems.map((k) => {
        return {
          wordcode: k.wordcode,
          wordname: k.wordname,
        };
      });
      setAgainTrack({
        tckid: this.chooseRecord.tckid,
        regid: this.chooseRecord.regid,
        explain: this.chooseRecord.explain,
        trackdetaiiItems,
      }).then((res) => {
        this.$message.success(res.message);
        this.handleGetTrackDetail();
      });
    },
    // 数据是否随访
    handleChangeReturnVisit(data) {
      if (data.checked) {
        this.trackdetaiiItems.push(data);
      } else {
        // wordcode
        let flag = this.trackdetaiiItems.findIndex(
          (k) => k.wordcode == data.wordcode
        );
        flag != -1 && this.trackdetaiiItems.splice(flag, 1);
      }
      console.log(this.trackdetaiiItems);
    },
    // 选中随访记录数据回调
    handleSelectRecord(row) {
      this.chooseRecord = JSON.parse(JSON.stringify(row));
      this.chooseRecord.trackdetaiiItems =
        this.chooseRecord.trackdetaiiItems.map((k) => {
          return {
            ...k,
            checked: false,
          };
        });
      console.log(this.chooseRecord.trackdetaiiItems);
    },
    // 获取追踪详情信息
    handleGetTrackDetail() {
      getTrackDetail({ regid: this.chooseStaff.regid }).then((res) => {
        this.recordData = res.result;
      });
    },
    // 获取追踪人员列表信息
    handleGetLoadTrack() {
      let whereitems = [];
      Object.keys(this.searchForm).forEach((k) => {
        if (this.searchForm[k] !== "") {
          whereitems.push({
            key: k,
            value: this.searchForm[k],
          });
        }
      });
      getLoadTrack({
        page: 1,
        limit: 10000000,
        whereitems,
      }).then((res) => {
        this.staffData = res.data;
      });
    },
    // 筛选时间变化回调\
    handleChangeSearchDate(date) {
      if (date) {
        this.searchForm.startdate = date[0];
        this.searchForm.enddate = date[1];
      } else {
        this.searchForm.startdate = "";
        this.searchForm.enddate = "";
      }
      this.handleGetLoadTrack();
    },
    //  人员列表选中数据回调
    handleSelectStaff(arr) {
      this.choossePeople = arr;
      // this.chooseStaff = JSON.parse(JSON.stringify(row));
      // this.chooseStaff.age = `${this.chooseStaff.age}岁`;
      // this.chooseStaff.regid && this.handleGetTrackDetail(); // 获取详情
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
    // 列表下载
    downloadExcel() {
      if (this.choossePeople.length == 0) {
        this.$message.warning("请选择需要导出的信息!");
        return false;
      }
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.excelData = this.choossePeople;
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
          "身份证号",
          "联系电话",
          "单位",
          "状态",
          "异常结果",
          "优先级",
          "随访医生",
          "随访时间",
          "随访说明",
          "下次随访",
        ]; // 导出的表头名信息
        const filterVal = [
          "name",
          "sex",
          "age",
          "regid",
          "idcard",
          "telephone",
          "companyname",
          "trackstatuscn",
          "wordname",
          "wordlevel",
          "doctorname",
          "checkdate",
          "explain",
          "nexttrackdate",
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
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnSearch": // 查询
          this.handleGetLoadTrack();
          break;
        case "btnReset": // 重置
          this.$reload();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnExport1": // 关闭当前页面
          this.downloadExcel();
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
@import "./css/index.scss";
</style>