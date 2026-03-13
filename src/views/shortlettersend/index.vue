<template>
  <div class="shortlettersend">
    <!-- 头部操作控件 -->
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn moduleName="customerResult" ref="companysettlement" size="mini" v-on:btn-event="hadnleOnBtnClicked">
        </permission-btn>
      </div>
    </sticky>
    <div class="subject">
      <div class="search_box">
        <div class="search_head">
          <div class="logo"></div>
          查询条件
        </div>
        <el-form ref="form" :model="searchForm" label-width="90px">
          <el-row>
            <el-col :span="6">
              <el-form-item class="checkup_date" size="mini" label="登记日期">
                <el-date-picker @change="handleChangeDate" @clear="handleSearchPageTable" size="mini" v-model="conditionDate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item class="checkup_code" size="mini" label="体检号">
                <el-input size="mini" clearable ref="checkupWorkInput" @clear="handleSearchPageTable" v-model="searchForm.regid" placeholder="请输入体检号" @keyup.native.enter="handleSearchPageTable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item class="select" size="mini" label="体检中心">
                <el-select v-model="searchForm.meccode" clearable @change="handleSearchPageTable">
                  <el-option v-for="(item, index) in meccodeitems" :key="index" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item class="select" size="mini" label="体检性质">
                <el-select v-model="searchForm.persontype" clearable @change="handleSearchPageTable">
                  <el-option label="全部" :value="''"></el-option>
                  <el-option label="个检" :value="'0'"></el-option>
                  <el-option label="团检" :value="'1'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item class="input" size="mini" label="姓名">
                <el-input v-model="searchForm.name" clearable @clear="handleSearchPageTable" @keyup.native.enter="handleSearchPageTable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item class="checkup_date" size="mini" label="预约时间">
                <el-date-picker @change="handleChangeDateRegister" @clear="handleSearchPageTable" size="mini" v-model="registerDate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item class="input" size="mini" label="电话">
                <el-input v-model="searchForm.telephone" clearable @clear="handleSearchPageTable" @keyup.native.enter="handleSearchPageTable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item class="select" size="mini" label="体检类型">
                <el-select v-model="searchForm.checktype" clearable @change="handleSearchPageTable">
                  <el-option v-for="(item, index) in checktypeitems" :key="index" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item class="select" size="mini" label="团检名称">
                <el-select filterable v-model="searchForm.companycode" clearable @change="handleChangeCompany">
                  <el-option v-for="(item, index) in companyitems" :key="index" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item class="select" size="mini" label="批次">
                <el-select v-model="searchForm.batch" clearable filterable @change="handleSearchPageTable">
                  <el-option v-for="(item, index) in batchitems" :key="index" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item class="input" size="mini" label="身份证">
                <el-input v-model="searchForm.idcard" clearable @clear="handleSearchPageTable" @keyup.native.enter="handleSearchPageTable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item class="select" size="mini" label="部门">
                <el-select v-model="searchForm.departcode" clearable filterable @change="handleSearchPageTable">
                  <el-option v-for="(item, index) in departitems" :key="index" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item class="select" size="mini" label="状态">
                <el-select v-model="searchForm.status" clearable @change="handleSearchPageTable">
                  <el-option v-for="(item, index) in statusitems" :key="index" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item class="select" size="mini" label="发送状态">
                <el-select v-model="searchForm.smsstatus" clearable @change="handleSearchPageTable">
                  <el-option label="未发送" value="none"></el-option>
                  <el-option label="发送成功" value="success"></el-option>
                  <el-option label="发送失败" value="fail"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item class="select" size="mini" label="短信名称">
                <el-select v-model="tempname" filterable clearable @change="handleChangeTempname">
                  <el-option v-for="(item, index) in noticetemplateData" :key="index" :label="item.tempname" :value="item.tempid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item class="select" size="mini" label="团检分组">
                <el-select v-model="searchForm.groupcode" clearable filterable @change="handleChangeGroup">
                  <el-option v-for="(item, index) in groupitems" :key="index" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 主体内容 -->
      <div class="mainbody">
        <el-row>
          <el-col :span="9" class="mainbody_l">
            <div class="page_table">
              <vxe-table ref="pageTablePeople" height="auto" border="inner" :loading="loading" highlight-hover-row :data="pageData" :sort-config="{ trigger: 'cell' }" :checkbox-config="{ reserve: true, trigger: 'row' }" @checkbox-change="handleSelectPeople" @checkbox-all="handleSelectPeopleAll" @cell-click="handleChoosePeople" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" row-id="regid">
                <vxe-table-column type="checkbox" width="40px" :reserve-selection="true"></vxe-table-column>
                <vxe-table-column field="statusname" title="状态" min-width="90px" show-header-overflow show-overflow="title" show-footer-overflow>
                  <template slot-scope="scope">
                    <div>
                      <span style="color: #2b87e6" v-show="scope.row.status == 0">已登记</span>
                      <span style="color: #6b2ae6" v-show="scope.row.status == 1">已预约</span>
                      <span style="color: #d82ae6" v-show="scope.row.status == 2">已签到</span>
                      <span style="color: #e62a57" v-show="scope.row.status == 3">体检中</span>
                      <span style="color: #2abbe6" v-show="scope.row.status == 4">已交表</span>
                      <span style="color: #130c80" v-show="scope.row.status == 5">可总检</span>
                      <span style="color: #e6902a" v-show="scope.row.status == 6">已总检</span>
                      <span style="color: #2be62a" v-show="scope.row.status == 7">
                        已审核
                      </span>
                    </div>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="smsstatus" title="发送状态" min-width="90px" show-header-overflow show-overflow="title" show-footer-overflow>
                  <template slot-scope="scope">
                    {{
                      scope.row.smsstatus == -1
                        ? "未发送"
                        : scope.row.smsstatus == 0
                        ? "失败"
                        : "成功"
                    }}
                  </template>
                </vxe-table-column>
                <vxe-table-column field="regid" title="体检号" width="120px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
                <vxe-table-column field="name" title="姓名" width="90px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
                <vxe-table-column field="sex" title="性别" width="90px" show-header-overflow show-overflow="title" show-footer-overflow>
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.sex == 0
                        ? "未知"
                        : scope.row.sex == 1
                        ? "男"
                        : "女"
                    }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="age" title="年龄" width="90px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
                <vxe-table-column field="telephone" title="联系电话" width="110px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
                <vxe-table-column field="setmealname" title="套餐" min-width="110px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
                <vxe-table-column field="regdate" title="登记日期" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              </vxe-table>
            </div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 1000, 5000, 10000, 50000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
            </el-pagination>
          </el-col>
          <el-col :span="15" class="mainbody_r">
            <div class="smscontent">
              <el-input class="conc_text" type="textarea" resize="none" v-model="tempcontent"></el-input>
            </div>
            <div class="smshistorylist">
              <div class="search_head">
                <div class="logo"></div>
                历史发送记录
              </div>
              <div class="smshistorylist_table">
                <vxe-table ref="pageTable" height="auto" border="inner" :loading="loading" highlight-hover-row :data="historyData" :sort-config="{ trigger: 'cell' }" :checkbox-config="{ reserve: true, trigger: 'row' }" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName">
                  <vxe-table-column field="sourceCategory" title="短信来源" width="120px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="sourceCode" title="来源编码" width="120px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="createPerson" title="发送人" width="120px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="signName" title="签名模板" width="120px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="createTime" title="发送时间" width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="receiverMobile" title="接收电话" width="140px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="smsBody" title="短信内容" width="140px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="runStatus" title="发送状态" width="100px" show-header-overflow show-overflow="title" show-footer-overflow>
                    <template slot-scope="scope">
                      <span>{{
                        scope.row.runStatus == 1 ? "成功" : "失败"
                      }}</span>
                    </template>
                  </vxe-table-column>
                </vxe-table>
              </div>
            </div>
            <div class="smsdetermine">
              <div class="smsdetermine_l">
                <el-input class="conc_text" type="textarea" resize="none" disabled v-model="conclusiontext"></el-input>
              </div>
              <div class="smsdetermine_r">
                <el-input class="conc_text" type="textarea" resize="none" disabled v-model="healthadvice"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import {
  getLoadSearchInfo,
  getBatch,
  getPageList,
  getExportFile,
  ReportExport,
  DownloadHead,
} from "@/api/fullsearch.js";
import { getTotalCheckQyzyy } from "@/api/totalcheck.js"; // 引入接口文件
// 引入页面接口
import { getPersonalDetail } from "@/api/personalregister.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import {
  DicNoticetemplateLoad,
  SmsLoadByPhone,
  SendSMS,
} from "@/api/noticetemplate.js";
export default {
  name: "shortlettersend",

  components: {
    Sticky,
    permissionBtn,
  },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },

  data() {
    return {
      searchForm: {
        regid: "",
        idcard: "",
        name: "",
        startdate: "",
        enddate: "",
        meccode: "",
        status: "",
        persontype: "",
        companycode: "",
        checktype: "",
        groupcode: "",
        batch: "",
        telephone: "",
        smsstatus: "",
        smscategroy: "",
      },
      conditionDate: [],
      registerDate: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      }, // 日期选择器配置
      meccodeitems: [],
      companyitems: [],
      batchitems: [],
      groupitems: [],
      departitems: [],
      statusitems: [],
      checktypeitems: [],
      loading: false,
      currentPage: 1,
      pageSize: 100,
      count: 0,
      pageData: [],
      selectArr: [],
      historyData: [],
      noticetemplateData: [],
      tempname: "",
      tempcontent: "",
      conclusiontext: "",
      healthadvice: "",
      currentRegid: "",
      tempcategroy: "",
      prevRegid: "",
      currentPhone: "",
    };
  },

  mounted() {
    this.handleGetLoadSearchInfo();
    getPersonalDetail().then((res) => {
      if (!res.result) return;
      this.checktypeitems = res.result.checktypeitems;
    });
    this.handleGetPrintDate();
    this.handleDicNoticetemplateLoad();
  },

  methods: {
    // 点击发送短信接口
    handleSendSMS() {
      if (!this.tempname) {
        this.$message.warning("请先选中短信名称内容!");
        return;
      }
      if (this.selectArr.length == 0) {
        this.$message.warning("请先选中需要发送短信的人员!");
        return;
      }
      SendSMS({
        tempcategroy: this.tempcategroy,
        regiditems: this.selectArr.map((k) => k.regid),
        content: this.tempcontent,
      }).then((res) => {
        this.$message.success(
          `发送成功${res.result.success}人，发送失败${
            res.result.fail
          }人，共计发送${res.result.success + res.result.fail}人`
        );
        // this.$message.success(res.message);
        this.selectArr = [];
        this.$refs.pageTablePeople.clearCheckboxRow();
        this.handleSearchPageTable();
      });
    },
    // 点击当前行人员回调
    handleChoosePeople({ row }) {
      if (!row) return;
      this.prevRegid = row.regid;
      if (this.prevRegid !== this.currentRegid) {
        this.currentRegid = row.regid;
        this.currentPhone = row.telephone;
        this.handleGetTotalCheck();
        this.currentPhone && this.handleSmsLoadByPhone();
      }
    },
    // 获取历史发送记录列表数据
    handleSmsLoadByPhone() {
      SmsLoadByPhone({ mp: this.currentPhone }).then((res) => {
        if (!res.data) return;
        this.historyData = res.data;
      });
    },
    // 获取总检详情接口回调
    handleGetTotalCheck() {
      let whereitems = [
        {
          key: "regid",
          value: this.currentRegid.trim(),
        },
      ];
      getTotalCheckQyzyy({ whereitems }).then((res) => {
        if (!res.result) return;
        this.conclusiontext = res.result.conclusiontext;
        this.healthadvice = res.result.healthadvice;
      });
    },
    // 改变短信名称回调
    handleChangeTempname(val) {
      let flag = this.noticetemplateData.filter((k) => k.tempid == val)[0];
      if (flag) {
        this.tempcontent = flag.content;
        this.tempcategroy = flag.tempcategroy;
        this.searchForm.smscategroy = flag.tempcategroy;
      } else {
        this.tempcontent = "";
        this.tempcategroy = "";
        this.searchForm.smscategroy = "";
      }
      this.handleSearchPageTable();
    },
    // 获取当前页面人员数据列表
    handleSearchPageTable() {
      this.loading = true;
      let whereitems = [];
      Object.keys(this.searchForm).forEach((item) => {
        if (this.searchForm[item]) {
          whereitems.push({
            key: item,
            value: this.searchForm[item],
          });
        }
      });
      getPageList({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          if (res.data) {
            this.count = res.count;
            this.pageData = res.data;
          } else {
            this.count = 0;
            this.pageData = [];
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 保存通知模板表单列表
    handleDicNoticetemplateLoad() {
      DicNoticetemplateLoad({
        page: 1,
        limit: 100000,
        key: "",
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.noticetemplateData = [];
            return;
          }
          this.noticetemplateData = res.data;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    handleSelectPeopleAll({ records }) {
      this.selectArr = records;
      console.log(this.selectArr);
    },
    // 人员列表选中数据回调
    handleSelectPeople({ records }) {
      this.selectArr = records;
      console.log(this.selectArr);
    },
    // 当前改变每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleSearchPageTable();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleSearchPageTable();
    },
    // 单位下拉列表改变值触发回调
    handleChangeCompany() {
      this.handleGetBatch();
    },
    // 选择单位请求批次号回调
    handleGetBatch() {
      getBatch({ companycode: this.searchForm.companycode }).then((res) => {
        this.searchForm.batch = ""; // 重置批次号
        let { batchitems } = res.result;
        this.batchitems = batchitems;
        let selectIndex = batchitems.findIndex((k) => k.selected);
        if (selectIndex > -1) {
          this.searchForm.batch = batchitems[selectIndex].code;
          this.groupitems = batchitems[selectIndex].groupitems;
          this.departitems = batchitems[selectIndex].departitems;
          let group = batchitems[selectIndex].groupitems.filter(
            (k) => k.selected
          )[0];
          group && (this.searchForm.groupcode = group.code);
        }
      });
    },
    handleChangeGroup(value) {
      if (value != "") {
        let flag = this.groupitems.filter((k) => {
          return value === k.code;
        })[0];
        flag && (this.departitems = flag.departitems);
      } else {
        let flag = this.batchitems.filter((k) => {
          return this.searchForm.batch === k.code;
        })[0];
        flag && (this.departitems = flag.departitems);
      }
      this.handleSearchPageTable();
    },
    handleGetPrintDate() {
      getSysConfigInfo({ cc: "Sys_FullSearch_DateRange" }).then((res) => {
        // 获取条件计算日期范围回调
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
        this.conditionDate = [this.gettime(start), this.gettime(end)];
        this.registerDate = [this.gettime(start), this.gettime(end)];
        this.searchForm.startdate = this.gettime(start);
        this.searchForm.enddate = this.gettime(end);
        this.searchForm.startregisterdate = this.gettime(start);
        this.searchForm.endregisterdate = this.gettime(end);
        // this.handleSearchPageTable();
      });
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
    // 加载搜索条件返回合集回调
    handleGetLoadSearchInfo() {
      getLoadSearchInfo().then((res) => {
        let { meccodeitems, companyitems, statusitems } = res.result;
        this.meccodeitems = meccodeitems; // 体检中心集合
        this.companyitems = companyitems; // 公司集合
        this.statusitems = statusitems; // 状态集合
      });
    },
    // 点击检索条件筛选全部回调
    handleChangeDate(arr) {
      if (arr) {
        this.searchForm.startdate = arr[0];
        this.searchForm.enddate = arr[1];
      } else {
        this.searchForm.startdate = "";
        this.searchForm.enddate = "";
      }
      this.handleSearchPageTable();
    },
    // 点击检索条件筛选全部回调
    handleChangeDateRegister(arr) {
      if (arr) {
        this.searchForm.startregisterdate = arr[0];
        this.searchForm.endregisterdate = arr[1];
      } else {
        this.searchForm.startregisterdate = "";
        this.searchForm.endregisterdate = "";
      }
      this.handleSearchPageTable();
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
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnSearch": // 查询
          this.handleSearchPageTable();
          break;
        case "btnReset": // 重置当前页面
          this.$reload();
          break;
        case "btnSendSms": // 重置当前页面
          this.handleSendSMS();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 表头样式调整
    handleReturnStyle({ row, rowIndex }) {
      let stylejson = {};
      // stylejson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      stylejson.color = "#000";
      stylejson["font-weight"] = "bold";
      stylejson.height = "32px";
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

  watch: {},
};
</script>
<style lang='scss' scoped>
.shortlettersend {
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  .filter-container {
    display: flex;
    background-color: #f8f8f8;
    padding-right: 20px;
    height: 42px;
    align-items: center;
    justify-content: flex-end;
    > div {
      margin-left: 10px;
    }
  }
  .subject {
    width: 100%;
    height: calc(100% - 42px);
    box-sizing: border-box;
    background-color: #fff;
    padding: 5px;
    .search_box {
      height: 176px;
      .search_head {
        height: 25px;
        color: #000;
        font-size: 18px;
        font-weight: 600;
        box-sizing: border-box;
        background-color: #f6f7fc;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        padding-left: 10px;
        .logo {
          width: 7px;
          height: 20px;
          background-color: #5c7ceb;
          border-radius: 3.5px;
          margin-right: 5px;
        }
      }
      .el-form-item {
        margin-bottom: 6px;
        .el-select {
          width: 100%;
        }
      }
      .checkup_date {
        .el-date-editor {
          width: 100%;
        }
      }
    }
    .mainbody {
      width: 100%;
      height: calc(100% - 176px);
      box-sizing: border-box;
      .el-row {
        height: 100%;
        .mainbody_l {
          height: 100%;
          .page_table {
            height: calc(100% - 36px);
          }
          /deep/.el-pagination {
            text-align: center;
          }
        }
        .mainbody_r {
          height: 100%;
          box-sizing: border-box;
          padding-left: 5px;
          .smscontent {
            height: 33%;
            .conc_text {
              height: 100%;

              /deep/.el-textarea__inner {
                background-color: #fff !important;
                height: 100% !important;
              }
            }
          }
          .smshistorylist {
            height: calc(33% - 10px);
            margin: 5px 0;
            .search_head {
              height: 25px;
              color: #000;
              font-size: 18px;
              font-weight: 600;
              box-sizing: border-box;
              background-color: #f6f7fc;
              display: flex;
              align-items: center;
              padding-left: 10px;
              .logo {
                width: 7px;
                height: 20px;
                background-color: #5c7ceb;
                border-radius: 3.5px;
                margin-right: 5px;
              }
            }
            .smshistorylist_table {
              height: calc(100% - 25px);
            }
          }
          .smsdetermine {
            height: 33%;
            display: flex;
            .smsdetermine_l {
              width: calc(50% - 5px);
              margin-right: 5px;
              .conc_text {
                height: 100%;
                /deep/.el-textarea__inner {
                  height: 100% !important;
                  background-color: #fff !important;
                }
              }
            }
            .smsdetermine_r {
              width: 50%;
              .conc_text {
                height: 100%;
                /deep/.el-textarea__inner {
                  height: 100% !important;
                  background-color: #fff !important;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>