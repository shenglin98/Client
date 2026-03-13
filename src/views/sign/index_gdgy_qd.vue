<template>
  <div class="sign">
    <!-- 头部操作控件 -->
    <sticky :className="'sub-navbar'">
      <!-- <div class="filter-container">
          <permission-btn moduleName="sign" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
        </div> -->
      <div class="filter-container">
        <div v-for="(btn, index) of buttons" :key="index">
          <el-popover ref="popoverRefIdc" v-if="domIdArr.includes(btn.domId)" class="print_box" placement="bottom" trigger="click">
            <el-button type="primary" plain slot="reference" :size="size" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" class="filter-item"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
            <div class="print_item" @click="hadnleOnBtnClicked(btn.domId)">
              打印
            </div>
            <div class="print_item" @click="handlePreview(btn.domId)">预览</div>
          </el-popover>
          <el-button type="primary" plain v-else :size="size" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" class="filter-item" @click="hadnleOnBtnClicked(btn.domId)"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
        </div>
      </div>
    </sticky>
    <!-- 主体数据结构 -->
    <div class="app-container">
      <el-row class="bg_white">
        <!-- 主体内容左侧 -->
        <el-col :span="8">
          <div class="content_left">
            <div class="head">
              <div class="logo"></div>
              检索条件
            </div>
            <div class="check_date">
              <!-- <el-button plain type="primary" style="width:80px" size="mini" slot="reference">登记日期</el-button> -->
              <el-popover ref="popoverRefData" placement="bottom-start" trigger="click">
                <div class="content">
                  <div class="content_item" v-for="item in checkupDate" :key="item.code" @click="handleSelectConditionDate(item)">
                    {{ item.name }}
                  </div>
                </div>
                <el-button type="primary" plain style="width: 80px" size="mini" slot="reference">{{ conditionDate }}</el-button>
              </el-popover>
              <el-date-picker v-model="queryDate" unlink-panels @change="handleChangeDate" size="mini" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" class="daterange">
              </el-date-picker>
              <el-button plain type="primary" style="margin-left: 12px" size="mini" @click="handleInputWork" icon="el-icon-search">查询</el-button>
            </div>
            <div class="checkup_code">
              <el-popover ref="popoverRef" placement="bottom-start" trigger="click">
                <div class="content">
                  <div class="content_item" v-for="item in checkupCodeArr" :key="item.code" @click="handleSelectCondition(item)">
                    {{ item.name }}
                  </div>
                </div>
                <el-button type="primary" plain style="width: 80px" size="mini" slot="reference">{{ condition }}</el-button>
              </el-popover>
              <!-- <el-button plain type="primary" style="width:80px" size="mini" slot="reference">体检号</el-button> -->
              <!-- <el-input
                  size="mini"
                  clearable
                  ref="inputWork"
                  @clear="handleInputWork"
                  @keyup.enter.native="handleInputWork"
                  v-model="checkupWork"
                ></el-input> -->
              <input type="text" class="read_card" v-model.lazy="checkupWork" ref="read_healthcard" @keyup.enter="handleInputWorkScanCode" />
            </div>
            <div class="checkup_code">
              <el-button plain type="primary" style="width:80px" size="mini" slot="reference">体检性质</el-button>
              <el-select v-model="persontype" size="mini" clearable @change="handleGetPersonalRegisterList">
                <el-option label="全部" :value="''"></el-option>
                <el-option label="个检" :value="'0'"></el-option>
                <el-option label="团检" :value="'1'"></el-option>
              </el-select>
            </div>
            <div class="checkup_code">
              <el-button plain type="primary" style="width:80px" size="mini" slot="reference">体检类型</el-button>
              <el-select v-model="checktype" size="mini" clearable @change="handleGetPersonalRegisterList">
                <el-option v-for="(item, index) in checktypeitemsPD" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="checkup_code">
              <el-button plain type="primary" style="width:80px" size="mini" slot="reference">团检名称</el-button>
              <el-select v-model="companycode" size="mini" clearable filterable @change="handleGetPersonalRegisterList">
                <el-option v-for="(item, index) in companyitemsPD" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="checkup_btn">
              <el-button plain type="primary" size="mini" @click="handleChangeStatus('')">全部</el-button>
              <el-button plain type="primary" size="mini" @click="handleChangeStatus(0)">待签到</el-button>
              <el-button plain type="primary" size="mini" @click="handleGetSign(0)">已签到</el-button>
              <!-- <el-button plain type="primary" size="mini" @click="handleChangeStatus(2)">待交表</el-button>
              <el-button plain type="primary" size="mini" @click="handleGetSign(1)">已交表</el-button> -->
            </div>
            <EasyTable row-id="regid" :loading="loadingCondition" class="condition_table" height="100%" :data="conditionData" :tableOptions="conditionOptions" :radio-config="{ selectedVal: setmealRadio, rowClick: true }" @checked-change="handleCheckCondition" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
            <el-pagination :pager-count="5" :small="true" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
            </el-pagination>
          </div>
        </el-col>
        <!-- 主体内容右侧 -->
        <el-col :span="16">
          <div class="content_right">
            <!-- 基本信息/其他信息 -->
            <div class="message">
              <!-- 打印开关 -->
              <el-switch v-model="autoSignin" active-color="#13ce66" inactive-color="#909399" active-text="自动签到">
              </el-switch>
              <!-- <el-switch v-model="autoCrossCousin" active-color="#13ce66" inactive-color="#909399" active-text="自动交表">
              </el-switch> -->
              <el-switch v-model="barCodePrint" active-color="#13ce66" inactive-color="#909399" active-text="打印条码">
              </el-switch>
              <el-switch v-model="guideSinglePrint" active-color="#13ce66" inactive-color="#909399" active-text="打印指引单">
              </el-switch>
              <el-switch v-model="labelPrint" active-color="#13ce66" inactive-color="#909399" active-text="打印标签">
              </el-switch>
            </div>
            <!-- 个人信息 -->
            <div class="personal_info">
              <div class="head">
                <div class="logo"></div>
                个人信息
              </div>
              <!-- 主体表单form -->
              <div class="info_body">
                <div class="form_box">
                  <el-form ref="form" disabled :model="personalForm" label-width="100px">
                    <el-row>
                      <el-col :span="7">
                        <el-form-item size="mini" label="体检号">
                          <el-input disabled v-model="personalForm.regid"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="姓名">
                          <el-input v-model="personalForm.name"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="性别">
                          <el-input v-model="personalForm.sex"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item size="mini" label-width="50px" class="age" label="年龄">
                          <el-input type="text" class="age_num" v-model="personalForm.age"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="7">
                        <el-form-item class="birthday" size="mini" label="出生日期">
                          <el-date-picker style="width: 100%" value-format="yyyy-MM-dd" v-model="personalForm.birthday" type="date" placeholder="选择日期">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="婚姻">
                          <el-input v-model="personalForm.marriage"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="11">
                        <el-form-item size="mini" label="身份证">
                          <el-input v-model="personalForm.idcard"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="7">
                        <el-form-item size="mini" label="体检类型">
                          <el-input v-model="personalForm.checktype"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="电话">
                          <el-input v-model="personalForm.telephone"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="11">
                        <el-form-item size="mini" label="住址">
                          <el-input v-model="personalForm.address"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <!-- <el-row>
                        <el-col :span="6">
                          <el-form-item size="mini" label="HIS标识">
                            <el-input v-model="personalForm.hiscode"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row> -->
                  </el-form>
                </div>
                <!-- 照片 -->
                <div class="photo_box">
                  <!-- 录入头像 -->
                  <img :src="avatar" :draggable="false" class="avatar" alt="摄像头" />
                  <!-- 套餐明细弹框 -->
                </div>
              </div>
            </div>
            <!-- 团检信息 -->
            <div class="team_inspect">
              <div class="head">
                <div class="hand_title" style="width: 10%;">
                  <div class="logo"></div>
                  <span>团检信息</span>
                </div>
                <el-form style="width: 90%;" ref="form" disabled :model="personalForm" label-width="100px">
                  <el-row style="width: 100%;">
                    <el-col :span="10">
                      <el-form-item size="mini" label="团检名称">
                        <el-input v-model="personalForm.companyname"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item size="mini" label="团检批次">
                        <el-input v-model="personalForm.batch"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item size="mini" label="团检分组">
                        <el-input v-model="personalForm.groupcode"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>
            <!-- 体检项目 -->
            <div class="checkup_project">
              <div class="head">
                <div class="hand_title">
                  <div class="logo"></div>
                  <span>体检项目</span>
                </div>
                <div class="checkup_body">
                  <div class="state_group">
                    <div class="state_item">
                      <div class="title bg_1">总数</div>
                      <div class="state">{{ groupTableData.length }}</div>
                    </div>
                    <div class="state_item">
                      <div class="title bg_2">费用估计</div>
                      <div class="state">{{ groupPriceTotal.toFixed(2) }}</div>
                    </div>
                    <div class="state_item">
                      <div class="title bg_3">缴费</div>
                      <div class="state">{{ groupPriceEnd.toFixed(2) }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <EasyTable :loading="loading" class="group_table" ref="multipleTable" height="100%" :data="groupTableData" :tableOptions="tableOptions" :checkbox-config="{ rowClick: true, fetchVal: true }" @selected-change="handleSelectCombines" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 点击完成弹出提示弹框 - 分诊 -->
    <el-dialog title="" class="tefinish_dia" :visible.sync="showFinish" width="34%" :show-close="false" :close-on-click-modal="false">
      <span>
        <div class="tetop_userinfo">
          <div class="tetop_item">姓名：{{ personalForm.name }}</div>
          <div class="tetop_item">性别：{{ personalForm.sex}}</div>
          <div class="tetop_item">体检号：{{ personalForm.regid }}</div>
        </div>
        <div class="dtmessage">
          <div class="dtm_item">
            <div class="sgb">导诊信息</div>
          </div>
          <div class="dtm_item" v-for="item in finishTriag" :key="item">
            <div class="sgb">{{ item }}</div>
          </div>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseShowFinish">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 签到流程 -->
    <FlowPath v-if="showFlowPath" :regid="flowPathRegid" @close="handleCloseFlowPath" />
    <!-- 检索组件 -->
    <SearchDialog v-if="showSearch" :showSearch="showSearch" @close="handleCloseSearch" @submit="handleSearchSubmit" />
    <!-- 预览弹框 -->
    <el-dialog title="预览" class="preview_box" :visible.sync="dialogVisible" width="700px" @close="handleCloseDialog">
      <iframe ref="pdfCotainer" :src="pdfUrl" width="100%" style="height: calc(100vh - 147px)"></iframe>
    </el-dialog>
  </div>
</template>
  <script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import FlowPath from "@/components/flowPath"; // 签到流程组件
import { printBase64 } from "@/api/printreport.js";
import SearchDialog from "@/components/searchDialog";
import { getLoadSearchInfo } from "@/api/fullsearch.js";

// 引入页面接口
import {
  getPersonalRegisterList,
  getPersonalDetail,
  setSignIn,
  setCancelSign,
  setSignOut,
  AllowSign,
  setCancelSignOut,
  SetSign,
  GetSign,
  ClearSign,
} from "@/api/sign.js";
import { getFiles } from "@/api/customerbarcode.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import { mapGetters } from "vuex";
import {
  setDepartCheckGiveUp,
  setDepartCheckGiveUpCancel,
  setDelay,
  setCancelDelay,
} from "@/api/customerresult.js"; // 引入页面接口

export default {
  name: "sign",

  components: { Sticky, permissionBtn, FlowPath, SearchDialog },

  data() {
    return {
      showFlowPath: false, // 控制显示登记流程
      flowPathRegid: "", // 登记流程查询ID
      pageState: "", // 当前页面状态 add edit
      setmealRadio: "", // 单选选中id
      showCanvas: false,
      showChargeDetails: false,
      message: "基本信息", // 基本信息 其他信息
      healthCard: "", // 健康卡
      personalForm: {
        regid: "",
        checkno: "",
        healthcard: "",
        name: "",
        sex: 0,
        age: 0,
        ageunit: "岁",
        marriage: "未知",
        checktype: "",
        birthday: "",
        nation: "",
        occupation: "",
        telephone: "",
        address: "",
        idcard: "",
        hiscode: "",
        fileid: "",
        companycode: "",
        companyname: "",
        batch: "",
        groupcode: "",
        combineitems: "",
      }, // 个人信息
      avatar: require("./images/lin.jpg"),
      companyitems: [], // 团检名称 // 单位选择
      batchitems: [], // 团检名称 // 批次选择
      groupitems: [], // 团检名称 // 分组选择
      groupTableData: [], // 体检项目表信息
      groupPriceTotal: 0, // 体检项目总金额
      groupPriceEnd: 0, // 体检项目已经缴费金额
      conditionData: [], // 检索条件表信息
      condition: "体检号 ", //检索体检条件
      conditionCode: "regid",
      checkupWork: "", // 检索关键字
      checkupCodeArr: [
        { code: "regid", name: "体检号" },
        { code: "name", name: "姓名" },
        { code: "checkno", name: "档案号" },
        { code: "idcard", name: "身份证" },
        { code: "hiscode", name: "门诊卡号" },
        // { code: "name", name: "姓名" },
      ], // 检索条件身份证等数组
      healthcardcode: "idcard", //选中健康卡/身份证对象编码
      healthcardCheck: "身份证", //选中健康卡/身份证对象名称
      healthcardArr: [
        { code: "idcard", name: "身份证" },
        { code: "healthcard", name: "健康卡" },
      ], // 检索条件身份证等数组
      sexarr: [
        { code: 0, name: "未知" },
        { code: 1, name: "男" },
        { code: 2, name: "女" },
      ], // 性别选择
      marriagearr: [
        { code: "未知", name: "未知" },
        { code: "未婚", name: "未婚" },
        { code: "已婚", name: "已婚" },
        { code: "离异", name: "离异" },
      ], // 婚姻状态
      agearr: [
        { code: "岁", name: "岁" },
        { code: "月", name: "月" },
        { code: "天", name: "天" },
      ], // 年龄单位
      checktypeitems: [], //检查类型列表
      status: "", // 状态：status (0-待签到 1-已签到 2-待交表，3-已交表 “”-全部)
      choosePeople: undefined, // 当前选中编辑人员
      showProjectDialog: false, // 控制显示体检项目弹框.
      loading: false, // 加载效果
      chargeDataList: [], // 收费明细表格主表
      chargeDataItems: [], // 收费明细右侧明细表
      chargeTotalPrice: 0, // 收费明细总金额
      loadingGroup: false, //收费明细表格主表加载效果
      loadingItem: false, //收费明细右侧明细表加载效果
      loadingCondition: false, // 检索条件表格加载效果
      autoSignin: false, // 自动签到开关
      autoCrossCousin: false, // 自动交表开关
      barCodePrint: false, // 打印条码开关
      guideSinglePrint: false, // 打印条码开关
      labelPrint: false, // 打印条码开关
      currentPage: 1,
      pageSize: 100,
      count: 0,
      queryDate: [],
      checkupDate: [
        { code: "0", name: "登记日期" },
        { code: "3", name: "预约日期" },
        { code: "4", name: "体检日期" },
      ], // 检索条件日期类型
      conditionDate: "登记日期",
      timetype: "0", // 时间类型
      showSearch: false, //检索弹框显示
      buttons: [],
      domIdArr: ["btnLabel", "btnGuidance"],
      dialogVisible: false, // 预览弹框显示
      size: "mini",
      pdfUrl: "",
      timer: "",
      selectCombine: [],
      showFinish: false,
      finishTriag: [],
      checktypeitemsPD: [],
      companyitemsPD: [],
      companycode: "",
      checktype: "",
      persontype: "",
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 体检套餐表格配置
    tableOptions() {
      return [
        {
          type: "selection",
          width: 45,
          align: "center",
        },
        {
          title: "体检组合",
          prop: "combinename",
          width: 200,
          omit: 1,
        },
        {
          title: "原价",
          prop: "price",
        },
        {
          title: "折扣",
          prop: "discount",
          returnVal: (value) => {
            return `${value * 100} %`;
          },
        },
        {
          title: "折后价格",
          prop: "discountprice",
        },
        {
          title: "缴费",
          prop: "chargeflag",
          returnVal: (val) => {
            return val == 0
              ? "未收费"
              : val == 1
              ? "已收费"
              : val == 2
              ? "申请退费"
              : "已退费";
          },
        },
        {
          title: "检查科室",
          prop: "deptname",
          width: 150,
          omit: 1,
        },
        {
          title: "加减",
          prop: "addflag",
          returnVal: (val, row) => {
            return val == 1 ? "加" : row.dedflag == 1 ? "减" : "";
          },
        },
        {
          title: "开单医生",
          prop: "operatorname",
          width: 100,
          omit: 1,
        },
        {
          title: "开单时间",
          prop: "operatordate",
          width: 100,
          omit: 1,
        },
        {
          title: "检查状态",
          prop: "status",
          // returnVal: (val) => {
          //   return val == 0 ? "登记" : val == 1 ? "弃检" : "完成";
          // },
          enumType: [
            {
              value: 0,
              label: "登记",
            },
            {
              value: 1,
              label: "弃检",
            },
            {
              value: 2,
              label: "执行",
            },
            {
              value: 3,
              label: "完成",
            },
            {
              value: 4,
              label: "缓检",
            },
          ],
        },
        {
          title: "体检套餐",
          prop: "setmealname",
          width: 130,
          omit: 1,
        },
      ];
    },
    // 检索条件表信息表格配置
    conditionOptions() {
      return [
        {
          type: "radio",
          width: 45,
        },
        {
          type: "index",
          title: "序号",
          width: 55,
        },
        {
          title: "姓名",
          prop: "name",
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
          width: 130,
          omit: 1,
        },
        {
          title: "体检类型",
          prop: "checktypename",
          width: 120,
          omit: 1,
        },
        {
          title: "登记日期",
          prop: "regdate",
          width: 110,
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
      ];
    },
  },
  mounted() {
    // 获取按钮组数据
    let elements = this.$route.meta.elements;
    this.buttons = elements.sort((a, b) => {
      return a.sort - b.sort;
    });
    // 页面加载获取人员列表数据
    this.handleGetPrintDate();
    this.handleGetSign(1);
    this.handleGetLoadSearchInfo();
    getPersonalDetail().then((res) => {
      if (!res.result) return;
      this.checktypeitemsPD = res.result.checktypeitems;
    });
    setTimeout(() => {
      this.$refs.read_healthcard && this.$refs.read_healthcard.focus();
    }, 400);
  },

  methods: {
    // 加载搜索条件返回合集回调
    handleGetLoadSearchInfo() {
      getLoadSearchInfo().then((res) => {
        let { companyitems } = res.result;
        this.companyitemsPD = companyitems; // 公司集合
      });
    },
    handleCloseShowFinish() {
      this.showFinish = false;
      this.finishTriag = [];
    },
    // 页面人员延检回调
    handleGetDelayCheck() {
      if (!this.choosePeople) {
        this.$message.warning("请选择需要延检的人员!");
        return false;
      }
      if (this.selectCombine.length == 0) {
        this.$message.warning("请选择需要延检的项目!");
        return false;
      }
      if (this.choosePeople.status >= 7) {
        this.$message.warning("当前人员已审核项目不允许延检!");
        return false;
      }
      let isAbaflag = this.selectCombineObj.filter((k) => k.abaflag == 1);
      if (isAbaflag && isAbaflag.length > 0) {
        this.$message.warning("当前包含弃检项目不允许延检!");
        return false;
      }
      for (let i = 0; i < this.selectCombine.length; i++) {
        setDelay({
          regid: this.choosePeople.regid,
          checkno: this.choosePeople.checkno,
          combinecode: this.selectCombine[i],
        }).then((res) => {
          if (i == this.selectCombine.length - 1) {
            this.$message.success(res.message);
            this.handleGetPersonalDetail(this.choosePeople.regid);
          }
        });
      }
    },
    // 页面人员取消延检回调
    handleGetDelayCheckCancel() {
      if (!this.choosePeople) {
        this.$message.warning("请选择需要取消延检的人员!");
        return false;
      }
      if (this.selectCombine.length == 0) {
        this.$message.warning("请选择需要取消延检的项目!");
        return false;
      }
      for (let i = 0; i < this.selectCombine.length; i++) {
        setCancelDelay({
          regid: this.choosePeople.regid,
          checkno: this.choosePeople.checkno,
          combinecode: this.selectCombine[i],
        }).then((res) => {
          if (i == this.selectCombine.length - 1) {
            this.$message.success(res.message);
            this.handleGetPersonalDetail(this.choosePeople.regid);
          }
        });
      }
    },
    // 页面人员弃检回调
    handleGetGiveUpCheck() {
      if (!this.choosePeople) {
        this.$message.warning("请选择需要弃检的人员!");
        return false;
      }
      if (this.selectCombine.length == 0) {
        this.$message.warning("请选择需要弃检的项目!");
        return false;
      }
      if (this.choosePeople.status >= 7) {
        this.$message.warning("当前人员已审核项目不允许弃检!");
        return false;
      }
      let isDelayflag = this.selectCombineObj.filter((k) => k.delayflag == 1);
      if (isDelayflag && isDelayflag.length > 0) {
        this.$message.warning("当前包含延检项目不允许弃检!");
        return false;
      }
      for (let i = 0; i < this.selectCombine.length; i++) {
        setDepartCheckGiveUp({
          regid: this.choosePeople.regid,
          checkno: this.choosePeople.checkno,
          combinecode: this.selectCombine[i],
        }).then((res) => {
          if (i == this.selectCombine.length - 1) {
            this.$message.success(res.message);
            this.handleGetPersonalDetail(this.choosePeople.regid);
          }
        });
      }
    },
    // 页面人员取消弃检回调
    handleGetGiveUpCheckCancel() {
      if (!this.choosePeople) {
        this.$message.warning("请选择需要取消弃检的人员!");
        return false;
      }
      if (this.selectCombine.length == 0) {
        this.$message.warning("请选择需要取消弃检的项目!");
        return false;
      }
      for (let i = 0; i < this.selectCombine.length; i++) {
        setDepartCheckGiveUpCancel({
          regid: this.choosePeople.regid,
          checkno: this.choosePeople.checkno,
          combinecode: this.selectCombine[i],
        }).then((res) => {
          if (i == this.selectCombine.length - 1) {
            this.$message.success(res.message);
            this.handleGetPersonalDetail(this.choosePeople.regid);
          }
        });
      }
    },
    handleSelectCombines(arr) {
      this.selectCombineObj = arr;
      this.selectCombine = arr.map((k) => k.combinecode);
      console.log(arr);
    },
    // 关闭签到交表标记
    handleClearSign(flag) {
      ClearSign({ flag: 0 }).then((res) => {});
      ClearSign({ flag: 1 }).then((res) => {});
      flag == "clear" && this.handleGetSign(1);
    },
    // 预览窗口关闭
    handleCloseDialog() {
      this.pdfUrl = "";
      this.dialogVisible = false;
    },
    // 检索组件提交回调
    handleSearchSubmit(regid) {
      this.conditionCode = "regid";
      this.checkupWork = regid;
      // 加载获取登记信息叫号数据
      this.handleGetPersonalRegisterList();
    },
    // 检索组件显示回调
    handleShowSearch() {
      this.showSearch = true;
    },
    // 检索组件关闭回调
    handleCloseSearch(value) {
      this.showSearch = value;
    },
    // 点击选择检索体检条件回调
    handleSelectCondition(val) {
      this.condition = val.name;
      this.conditionCode = val.code;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    // 日期类型选中回调
    handleSelectConditionDate(item) {
      if (!item) return false;
      this.conditionDate = item.name;
      this.timetype = item.code;
      // this.queryDate = [];
      this.$refs.popoverRefData.doClose(); // 关闭弹出层popover
    },
    // 获取默认时间
    handleGetPrintDate() {
      getSysConfigInfo({ cc: "Sys_sign_DateRange" }).then((res) => {
        // 获取条件计算日期范围回调
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
        this.queryDate = [this.gettime(start), this.gettime(end)];
        // this.handleGetPersonalRegisterList();
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
    // 当前改变每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleGetPersonalRegisterList();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleGetPersonalRegisterList();
    },
    // 防抖函数
    debounceFunction() {
      // 清除之前的定时器
      clearTimeout(this.timer);
      // 设置新的定时器
      this.timer = setTimeout(() => {
        // 在定时器结束时执行函数逻辑
        console.log("执行防抖函数的逻辑");
        this.handleGetPersonalDetail(this.choosePeople.regid);
      }, 500); // 设置防抖的时间间隔，例如500毫秒
    },
    // 检索条件表信息选中行回调
    handleCheckCondition(row) {
      if (!row) return false;
      this.setmealRadio = row.regid;
      this.groupPriceTotal = 0; // 体检项目总金额
      this.groupPriceEnd = 0; // 体检项目已经缴费金额
      this.choosePeople = Object.assign({}, row);
      this.avatar = require("./images/lin.jpg");
      this.selectCombine = [];
      this.debounceFunction(); // 防抖-请求详情
      // this.choosePeople.fileid && this.handleGetFiles();
      this.pageState = "edit"; // 当前编辑状态
    },
    // id获取文件回调
    handleGetFiles() {
      getFiles({ Id: this.personalForm.fileid }).then((res) => {
        this.avatar = res.result.fileUrl;
      });
    },
    // 改变时间条件改变状态回调
    handleChangeDate(value) {
      if (!value) {
        this.$message.warning("必须提供登记时间!");
        return false;
      }
      this.queryDate = value;
      this.handleGetPersonalRegisterList();
    },
    // 点击检索条件改变状态回调
    handleChangeStatus(value) {
      this.status = value;
      this.handleGetPersonalRegisterList();
    },
    // 获取个人登记列表回调
    handleGetPersonalRegisterList() {
      this.loadingCondition = true;
      let whereitems = [];
      // 搜索关键词
      if (this.checkupWork) {
        whereitems.push({
          key: this.conditionCode,
          value: this.checkupWork,
        });
      }
      // 日期
      if (this.queryDate && this.queryDate.length > 0) {
        whereitems.push({
          key: "startdate",
          value: this.queryDate[0],
        });
        whereitems.push({
          key: "enddate",
          value: this.queryDate[1],
        });
      }
      whereitems.push({
        key: "status",
        value: this.status,
      });
      whereitems.push({
        key: "timetype",
        value: this.timetype,
      });
      if (this.persontype) {
        whereitems.push({
          key: "persontype",
          value: this.persontype,
        });
      }
      if (this.checktype) {
        whereitems.push({
          key: "checktype",
          value: this.checktype,
        });
      }
      if (this.companycode) {
        whereitems.push({
          key: "companycode",
          value: this.companycode,
        });
      }
      getPersonalRegisterList({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          this.conditionData = res.data;
          this.count = res.count;
          this.loadingCondition = false;
          this.checkupWork = "";
          if (
            (this.conditionCode === "regid" ||
              this.conditionCode === "hiscode") &&
            res.data.length === 1
          ) {
            this.setmealRadio = res.data[0].regid;
            this.choosePeople = res.data[0];
            if (this.choosePeople) {
              this.barCodePrint && this.handlePrintBarCode();
              this.guideSinglePrint && this.handlePrintGuideSingle();
              this.labelPrint && this.handlePrintLabel();
              if (this.autoSignin && !this.autoCrossCousin) {
                this.handleSignIn();
              } else if (!this.autoSignin && this.autoCrossCousin) {
                this.handleHandForm();
              } else if (this.autoSignin && this.autoCrossCousin) {
                setSignIn([this.choosePeople.regid]).then(async (res) => {
                  if (res.result.nextQueInfos.length > 0) {
                    this.finishTriag = res.result.nextQueInfos;
                    this.showFinish = true;
                  }
                  this.setmealRadio = this.choosePeople.regid; // 继续选中人员
                  //   页面加载获取人员列表数据
                  await this.handleGetPersonalRegisterList();
                  this.handleHandForm();
                });
              }
              // console.log(this.choosePeople, "this.choosePeople");
              // console.log(this.autoSignin, "自动签到0-1");
              // console.log(this.autoCrossCousin, "自动交表3");
            }
          }
        })
        .catch((err) => {
          this.conditionData = [];
          this.count = 0;
          this.loadingCondition = false;
        });
    },
    // 打印回调
    handleBtnPrint() {
      if (!this.choosePeople) {
        this.$message.warning("请先选择打印人员!");
        return false;
      }
      this.barCodePrint && this.handlePrintBarCode();
      this.guideSinglePrint && this.handlePrintGuideSingle();
      this.labelPrint && this.handlePrintLabel();
    },
    // 打印条码单回调
    handlePrintBarCode() {
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [this.choosePeople.regid],
        repname: "2、条码",
        whereitems: [
          {
            key: "regid",
            value: this.choosePeople.regid,
          },
        ],
      };
      printBase64(data).then((res) => {
        this.lodop = getLodop();
        let printname = ``;
        if (res.data[0].printname == "") {
          printname = this.lodop.GET_PRINTER_NAME(-1);
        } else {
          printname = res.data[0].printname;
        }
        let printObj = new LodopPrinter(null, printname);
        let fileList = res.data.map((k) => {
          return k.base64String;
        });
        printObj.printBase64PdfReport(this.lodop, fileList);
      });
    },
    // 文件打印预览
    handlePreview(domId) {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      if (!this.choosePeople) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行预览",
          type: "error",
        });
        return false;
      }
      this.dialogVisible = true;
      switch (domId) {
        // "btnLabel", "btnGuidance"
        case "btnGuidance": // 指引单
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "指引单") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [this.choosePeople.regid],
                repname: d.$children[0].$attrs["data-remark"],
                whereitems: [],
              };
              printBase64(data).then((res) => {
                let code = res.data[0].base64String.replace(/[\n\r]/g, "");
                let raw = window.atob(code);
                let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
                let uInt8Array = new Uint8Array(rawLength);
                for (let i = 0; i < rawLength; ++i) {
                  uInt8Array[i] = raw.charCodeAt(i);
                }
                let url = window.URL.createObjectURL(
                  new Blob([uInt8Array], { type: "application/pdf" })
                );
                if (url) this.dialogVisible = true;
                this.pdfUrl =
                  "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
              });
            }
          });
          break;
        case "btnLabel": // 指引单
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "标签单") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [this.choosePeople.regid],
                repname: d.$children[0].$attrs["data-remark"],
                whereitems: [],
              };
              printBase64(data).then((res) => {
                let code = res.data[0].base64String.replace(/[\n\r]/g, "");
                let raw = window.atob(code);
                let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
                let uInt8Array = new Uint8Array(rawLength);
                for (let i = 0; i < rawLength; ++i) {
                  uInt8Array[i] = raw.charCodeAt(i);
                }
                let url = window.URL.createObjectURL(
                  new Blob([uInt8Array], { type: "application/pdf" })
                );
                if (url) this.dialogVisible = true;
                this.pdfUrl =
                  "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
              });
            }
          });
          break;
        default:
          break;
      }
    },
    // 打印指引单回调
    handlePrintGuideSingle() {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [this.choosePeople.regid],
        repname: "1、指引单",
        whereitems: [
          {
            key: "regid",
            value: this.choosePeople.regid,
          },
        ],
      };
      printBase64(data).then((res) => {
        this.lodop = getLodop();
        let printname = ``;
        if (res.data[0].printname == "") {
          printname = this.lodop.GET_PRINTER_NAME(-1);
        } else {
          printname = res.data[0].printname;
        }
        let printObj = new LodopPrinter(null, printname);
        let fileList = res.data.map((k) => {
          return k.base64String;
        });
        printObj.printBase64PdfReport(this.lodop, fileList);
      });
    },
    // 打印标签单回调
    handlePrintLabel() {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [this.choosePeople.regid],
        repname: "2、标签单",
        whereitems: [
          {
            key: "regid",
            value: this.choosePeople.regid,
          },
        ],
      };
      printBase64(data).then((res) => {
        this.lodop = getLodop();
        let printname = ``;
        if (res.data[0].printname == "") {
          printname = this.lodop.GET_PRINTER_NAME(-1);
        } else {
          printname = res.data[0].printname;
        }
        let printObj = new LodopPrinter(null, printname);
        let fileList = res.data.map((k) => {
          return k.base64String;
        });
        printObj.printBase64PdfReport(this.lodop, fileList);
      });
    },
    // 获取个人登记明细/详情/新增回调
    handleGetPersonalDetail(regid) {
      this.loading = true;
      getPersonalDetail({
        regid,
      }).then((res) => {
        let data = res.result;
        console.log(data);
        this.personalForm = data;
        if (data.remindflag == 1 && data.remindcontent) {
          this.$confirm(`特殊提醒：${data.remindcontent}`, "系统提示", {
            confirmButtonText: "确定",
            showClose: false,
            showCancelButton: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            customClass: "expiretips",
            type: "warning",
          }).then(() => {});
        }
        // this.personalForm.fileid = "";
        this.personalForm.ageunit = "";
        this.personalForm.sex =
          data.sex == 0 ? "未知" : data.sex == 1 ? "男" : "女";
        this.personalForm.age = `${data.age}岁`;
        // 年龄单位列表 / 回显值
        this.agearr = data.ageunititems;
        this.personalForm.ageunit =
          data.ageunititems.filter((k) => k.selected)[0] &&
          data.ageunititems.filter((k) => k.selected)[0].code;
        // 婚姻状态列表 /  回显值
        this.marriagearr = data.marriageitem;
        this.personalForm.marriage =
          (data.marriageitem.filter((k) => k.selected)[0] &&
            data.marriageitem.filter((k) => k.selected)[0].code) ||
          "未知";
        // 下拉单位列表 /  回显值
        this.companyitems = data.companyitems;
        this.batchitems = data.batchitems;
        this.groupitems = data.groupitems;
        // 检查类型列表 / 回显值
        let checktype = data.checktypeitems.filter((k) => k.selected)[0];
        this.personalForm.checktype = checktype && checktype.name;
        let company = data.companyitems.filter((k) => k.selected)[0];
        let batch = data.batchitems.filter((k) => k.selected)[0];
        let group = data.groupitems.filter((k) => k.selected)[0];
        this.personalForm.companycode = company && company.code;
        this.personalForm.companyname = company && company.name;
        this.personalForm.batch = batch && batch.name;
        this.personalForm.groupcode = group && group.name;

        this.personalForm.fileid = data.fileid;
        this.personalForm.fileid && this.handleGetFiles(); // 获取头像文件
        // 赋值套餐列表
        this.groupTableData = data.combineitems;

        // 体检项目总金额
        data.combineitems.forEach((item) => {
          this.groupPriceTotal += item.price;
        });
        // 体检项目已经缴费金额
        data.combineitems.forEach((item) => {
          if (item.chargeflag == 1) {
            this.groupPriceEnd += item.price;
          }
        });
        this.loading = false; // 关闭加载
      });
    },
    // 收入检索身份证/条件号等回调
    handleInputWork() {
      this.handleGetPersonalRegisterList();
      this.checkupWork = "";
      setTimeout(() => {
        this.$refs.read_healthcard && this.$refs.read_healthcard.focus();
      }, 400);
    },
    handleGetSign(flag = 1) {
      GetSign({ flag }).then((res) => {
        this.conditionData = res.data;
      });
    },
    // 体检号输入框扫码事件
    handleInputWorkScanCode(code) {
      this.loadingCondition = true;
      let whereitems = [];
      // 搜索关键词
      if (this.checkupWork) {
        whereitems.push({
          key: this.conditionCode,
          value: this.checkupWork || code,
        });
      }
      // 日期
      if (this.queryDate && this.queryDate.length > 0) {
        whereitems.push({
          key: "startdate",
          value: this.queryDate[0],
        });
        whereitems.push({
          key: "enddate",
          value: this.queryDate[1],
        });
      }
      whereitems.push({
        key: "status",
        value: this.status,
      });
      whereitems.push({
        key: "timetype",
        value: this.timetype,
      });
      getPersonalRegisterList({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          let index =
            this.conditionData &&
            this.conditionData.findIndex((k) => k.regid == res.data[0].regid);
          if (index == -1) {
            this.conditionData.push(...res.data);
            this.count += +res.count;
          } else {
            this.conditionData = res.data;
            this.count = res.count;
          }
          console.log(this.conditionData);
          this.loadingCondition = false;
          this.checkupWork = "";
          if (
            (this.conditionCode === "regid" ||
              this.conditionCode === "hiscode") &&
            res.data.length === 1
          ) {
            // this.setmealRadio = res.data[0].regid;
            this.choosePeople = res.data[0];
            if (this.choosePeople) {
              this.barCodePrint && this.handlePrintBarCode();
              this.guideSinglePrint && this.handlePrintGuideSingle();
              this.labelPrint && this.handlePrintLabel();
              if (this.autoSignin && !this.autoCrossCousin) {
                setSignIn([this.choosePeople.regid]).then(async (res) => {
                  if (res.result.nextQueInfos.length > 0) {
                    this.finishTriag = res.result.nextQueInfos;
                    this.showFinish = true;
                  }
                  this.$message.success("人员签到成功!");
                  await SetSign({ regid: this.choosePeople.regid, flag: 0 });
                });
              } else if (!this.autoSignin && this.autoCrossCousin) {
                setSignOut([this.choosePeople.regid])
                  .then(async (res) => {
                    this.$message.success("人员交表成功!");
                    await SetSign({ regid: this.choosePeople.regid, flag: 1 });
                  })
                  .catch((err) => {
                    this.handleGetSign(1);
                  });
              } else if (this.autoSignin && this.autoCrossCousin) {
                setSignIn([this.choosePeople.regid]).then(async (res) => {
                  if (res.result.nextQueInfos.length > 0) {
                    this.finishTriag = res.result.nextQueInfos;
                    this.showFinish = true;
                  }
                  await SetSign({ regid: this.choosePeople.regid, flag: 0 });
                  setSignOut([this.choosePeople.regid]).then(async (res) => {
                    if (res.code == 500) {
                      this.handleGetSign(1);
                      return;
                    }
                    await SetSign({ regid: this.choosePeople.regid, flag: 1 });
                    this.$message.success("人员交表成功!");
                  });
                });
              }
            }
          }
          this.handleCheckCondition(this.choosePeople);
        })
        .catch((err) => {
          this.conditionData = [];
          this.count = 0;
          this.loadingCondition = false;
        });
      this.checkupWork = "";
      setTimeout(() => {
        this.$refs.read_healthcard && this.$refs.read_healthcard.focus();
      }, 400);
    },
    // 体检号输入框扫码事件 - 纯加载数据
    handleInputWorkScanCodeLoad(code) {
      console.log(code, "code");
      this.loadingCondition = true;
      let whereitems = [];
      // 搜索关键词
      if (this.checkupWork) {
        whereitems.push({
          key: "regid",
          value: code,
        });
      }
      // 日期
      if (this.queryDate && this.queryDate.length > 0) {
        whereitems.push({
          key: "startdate",
          value: this.queryDate[0],
        });
        whereitems.push({
          key: "enddate",
          value: this.queryDate[1],
        });
      }
      whereitems.push({
        key: "status",
        value: this.status,
      });
      whereitems.push({
        key: "timetype",
        value: this.timetype,
      });
      getPersonalRegisterList({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          let index =
            this.conditionData &&
            this.conditionData.findIndex((k) => k.regid === res.data[0].regid);
          if (index == -1) {
            this.conditionData.push(...res.data);
            this.count += +res.count;
          } else {
            this.conditionData = res.data;
            this.count = res.count;
          }
          this.loadingCondition = false;
          this.checkupWork = "";
          if (
            (this.conditionCode === "regid" ||
              this.conditionCode === "hiscode") &&
            res.data.length === 1
          ) {
            this.setmealRadio = res.data[0].regid;
            this.choosePeople = res.data[0];
          }
        })
        .catch((err) => {
          this.conditionData = [];
          this.count = 0;
          this.loadingCondition = false;
        });
      this.checkupWork = "";
      setTimeout(() => {
        this.$refs.read_healthcard && this.$refs.read_healthcard.focus();
      }, 400);
    },
    // 体检套餐行点击回调
    handleChecked(row) {
      console.log(row);
    },
    // 下拉改变单位选择值回调
    handleSelectComany(val) {
      let data = this.companyitems.filter((k) => k.code == val)[0];
      if (data) this.personalForm.companyname = data.name;
      this.hadnleGetBatchOrGroup();
    },
    // 下拉选中批次号触发回调
    handleSelectBatch(val) {
      let data = this.batchitems.filter((k) => k.code == val)[0];
      if (data) {
        this.groupitems = Object.assign([], data.groupitems);
      }
    },
    // 赋默认值无法切换回调
    handleSelectChange() {
      this.$forceUpdate();
    },
    // 控制显示登记流程
    handleShowFlowPath() {
      if (!this.choosePeople) {
        this.$message.warning("请先选择查看人员!");
        return false;
      }
      this.flowPathRegid = this.choosePeople.regid;
      this.showFlowPath = true;
    },
    // 控制显示登记流程
    handleCloseFlowPath(val) {
      this.showFlowPath = val;
    },
    // 处理人员签到回调
    handleSignInCode() {
      if (!this.choosePeople) {
        this.$message.warning("请先选择签到人员!");
        return false;
      }
      setSignIn([this.choosePeople.regid]).then((res) => {
        this.$message.success("人员签到成功!");
        if (res.result.nextQueInfos.length > 0) {
          this.finishTriag = res.result.nextQueInfos;
          this.showFinish = true;
        }
        // this.setmealRadio = ""; // 清空选中人员
        //   页面加载获取人员列表数据
        // this.handleInputWorkScanCodeLoad(this.choosePeople.regid);
      });
    },
    // 处理人员签到回调
    handleSignIn() {
      if (!this.choosePeople) {
        this.$message.warning("请先选择签到人员!");
        return false;
      }
      setSignIn([this.choosePeople.regid]).then(async (res) => {
        if (res.result.nextQueInfos.length > 0) {
          this.finishTriag = res.result.nextQueInfos;
          this.showFinish = true;
        }
        await SetSign({ regid: this.choosePeople.regid, flag: 0 });
        this.$message.success("人员签到成功!");
        // this.setmealRadio = ""; // 清空选中人员
        //   页面加载获取人员列表数据
        this.checkupWork = this.personalForm.regid;
        this.handleGetPersonalRegisterList();
      });
    },
    // 处理人员取消签到回调
    handleSetCancelSign() {
      if (!this.choosePeople) {
        this.$message.warning("请先选择取消签到人员!");
        return false;
      }
      setCancelSign([this.choosePeople.regid]).then((res) => {
        this.$message.success(res.message);
        // this.$reload();
        this.checkupWork = this.personalForm.regid;
        this.handleGetPersonalRegisterList();
      });
    },
    // 处理人员交表回调
    // handleHandFormCode() {
    //   if (!this.choosePeople) {
    //     this.$message.warning("请先选择交表人员!");
    //     return false;
    //   }
    //   setSignOut([this.choosePeople.regid]).then((res) => {
    //     this.$message.success("人员交表成功!");
    //     // this.setmealRadio = ""; // 清空选中人员
    //     //   页面加载获取人员列表数据
    //     this.handleInputWorkScanCodeLoad(this.choosePeople.regid);
    //   });
    // },
    // 处理人员交表回调
    handleHandForm() {
      if (!this.choosePeople) {
        this.$message.warning("请先选择交表人员!");
        return false;
      }
      AllowSign({ regid: this.choosePeople.regid }).then((res) => {
        if (res.result) {
          this.$confirm(`${res.result}是否继续交表?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              setSignOut([this.choosePeople.regid]).then(async (res) => {
                this.$message.success("人员交表成功!");
                await SetSign({ regid: this.choosePeople.regid, flag: 1 });
                this.handleGetPersonalRegisterList();
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        } else {
          setSignOut([this.choosePeople.regid]).then(async (res) => {
            this.$message.success("人员交表成功!");
            await SetSign({ regid: this.choosePeople.regid, flag: 1 });
            this.handleGetPersonalRegisterList();
          });
        }
      });
    },
    // 处理人员取消交表回调
    handleSetCancelSignOut() {
      if (!this.choosePeople) {
        this.$message.warning("请先选择取消交表人员!");
        return false;
      }
      setCancelSignOut([this.choosePeople.regid]).then((res) => {
        this.$message.success(res.message);
        // this.$reload();
        this.handleGetPersonalRegisterList();
      });
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
      console.log(domId);
      switch (domId) {
        case "btnGiveUp": // 弃检
          this.handleGetGiveUpCheck();
          break;
        case "btnGiveUpCancel": // 取消弃检
          this.handleGetGiveUpCheckCancel();
          break;
        case "btnDelay": // 延检
          this.handleGetDelayCheck();
          break;
        case "btnDelayCancel": // 取消延检
          this.handleGetDelayCheckCancel();
          break;
        case "btnSignIn": // 签到
          this.handleSignIn();
          break;
        case "btnSignInCancel": // 取消签到
          this.handleSetCancelSign();
          break;
        case "btnHandForm": // 交表
          this.handleHandForm();
          break;
        case "btnHandFormCancel": // 取消交表
          this.handleSetCancelSignOut();
          break;
        case "btnFlowPath": // 流程
          this.handleShowFlowPath();
          break;
        case "btnGuidance": // 打印指引单
          if (!this.choosePeople) {
            this.$message.warning("请先选择打印人员!");
            return false;
          }
          this.handlePrintGuideSingle();
          break;
        case "btnLabel": // 打印标签单
          if (!this.choosePeople) {
            this.$message.warning("请先选择打印人员!");
            return false;
          }
          this.handlePrintLabel();
          break;
        case "btnSearch": // 检索
          this.handleShowSearch();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClearSign();
          this.handleClosePage();
          break;
        case "btnEmpty": // 关闭当前页面
          this.handleClearSign("clear");
          break;
        default:
          break;
      }
    },
  },

  watch: {
    condition: {
      handler() {
        setTimeout(() => {
          this.$refs.read_healthcard && this.$refs.read_healthcard.focus();
        }, 400);
      },
      deep: true,
    },
  },
};
</script>
  <style lang='scss' scoped>
@import "./css/index.scss";
.condition_table {
  height: calc(100% - 420px) !important;
}
.tefinish_dia {
  /deep/.el-dialog__header {
    display: none;
  }
  /deep/.el-dialog__body {
    padding: 0px;
    .tetop_userinfo {
      display: flex;
      height: 50px;
      background-color: #ecf5ff;
      justify-content: space-around;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
    }
    .dtmessage {
      box-sizing: border-box;
      padding: 14px;
      .dtm_item {
        display: flex;
        font-size: 18px;
        .sgb {
          font-weight: 600;
        }
      }
    }
  }
  /deep/.el-dialog__footer {
    padding: 0 12px 12px 12px;
    text-align: center;
  }
}
</style>