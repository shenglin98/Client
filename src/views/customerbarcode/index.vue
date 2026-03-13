<template>
  <div class="customer_barcode">
    <!-- 头部操作控件 -->
    <sticky class="btn_group" :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn ref="permissionBtn" moduleName="customerResult" size="mini" v-on:btn-event="hadnleOnBtnClicked">
        </permission-btn>
      </div>
    </sticky>
    <!-- 主体内容 -->
    <div class="subject">
      <!-- 头部筛选条件 -->
      <div class="head_box">
        <div class="head_body">
          <div class="title" style="width: 96.5%">检索条件</div>
          <div class="checkno_box mt1">
            <div class="checkno">
              <!-- <el-button type="primary" size="mini" plain>体检号</el-button> -->
              <div style="width: 280px;display: flex;">
                <el-popover style="width: 90px;flex-shrink: 0;text-align: right;" ref="popoverRef" placement="bottom-start" trigger="click">
                  <div class="content">
                    <div class="content_item" v-for="item in checkupCodeArr" :key="item.code" @click="handleSelectCondition(item)">
                      {{ item.name }}
                    </div>
                  </div>
                  <el-button type="primary" plain style="padding: 7px 4px; margin-right: 5px" size="mini" slot="reference">{{ condition }}</el-button>
                </el-popover>
                <el-input style="width: 190px;flex-shrink: 0" v-model="regid" ref="checkupWorkInput" @keyup.native.enter="handleInputWork" size="mini" clearable>
                </el-input>
              </div>

              <div class="select_box">
                <div class="form_label">团检名称</div>
                <el-select v-model="companycode" filterable clearable @change="handleChangeCompany" size="mini">
                  <el-option v-for="(item, index) in companyitems" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
                </el-select>
              </div>
              <div class="select_box">
                <div class="form_label">批次</div>
                <el-select v-model="batch" clearable size="mini" @change="handleChangeBatch">
                  <el-option v-for="(item, index) in batchitems" :key="index" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </div>
              <div class="select_box">
                <div class="form_label">分组</div>
                <el-select style="width: 100%" v-model="group" size="mini" placeholder="" clearable @change="handleGetCustomerBarcodeList">
                  <el-option v-for="item in groupitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </div>
              <div class="select_box">
                <div class="form_label">部门</div>
                <el-select style="width: 100%" v-model="depart" size="mini" placeholder="" clearable @change="handleGetCustomerBarcodeList">
                  <el-option v-for="item in department" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </div>
              <div class="select_box">
                <div class="form_label">二级部门</div>
                <el-select style="width: 100%" v-model="depart2" size="mini" placeholder="" clearable @change="handleGetCustomerBarcodeList">
                  <el-option v-for="item in departitem2s" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </div>

              <!-- <el-button type="primary" size="mini" plain>叫号</el-button> -->
            </div>
            <div class="checkno">
              <div class="select_box">
                <div class="form_label">项目</div>
                <el-select style="width: 100%" v-model="combine" size="mini" placeholder="" clearable @change="handleChangeCombine">
                  <el-option v-for="item in combinData" :key="item.detid" :label="item.combinename" :value="item.combinename"></el-option>
                </el-select>
              </div>
              <div class="select_box">
                <div class="form_label">状态</div>
                <el-select style="width: 100%" v-model="status" size="mini" placeholder="" clearable @change="handleGetCustomerBarcodeList">
                  <el-option v-for="item in statusitems" :key="item.name" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </div>
            </div>
            <!-- <div class="switch">
              <el-switch v-model="switchFlag" active-text="确认同步打印条码">
              </el-switch>
            </div> -->
          </div>
          <!-- 表单筛选盒子 -->
          <div class="screen_box mt1">
            <el-col class="depart" :span="5">
              <div class="title">检查科室</div>
              <el-form ref="form" class="depart_form mt1" label-width="80px">
                <el-form-item size="mini" label="检查科室">
                  <el-select @change="handleChangeDepart" v-model="deptcode" clearable filterable>
                    <el-option v-for="(item, index) in departitems" :key="index" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="checkdate" size="mini" label="检查时间">
                  <el-date-picker v-model="collectdate" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd hh-mm-ss">
                  </el-date-picker>
                  <el-button :type="lockFlag ? 'success' : 'primary'" @click="handleLockTime">{{ lockFlag ? "解锁" : "锁定" }}</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col class="message" :span="18">
              <div class="title">基本信息</div>
              <el-form ref="form" class="message_form mt1" :model="messageForm" disabled label-width="80px">
                <el-form-item size="mini" label="体检号">
                  <el-input v-model="messageForm.regid"></el-input>
                </el-form-item>
                <el-form-item size="mini" label="姓名">
                  <el-input v-model="messageForm.name"></el-input>
                </el-form-item>
                <el-form-item size="mini" label="性别">
                  <el-input v-model="messageForm.sexs"></el-input>
                </el-form-item>
                <el-form-item size="mini" label="年龄">
                  <el-input v-model="messageForm.age"></el-input>
                </el-form-item>
                <el-form-item size="mini" label="婚姻">
                  <el-input v-model="messageForm.marriage"></el-input>
                </el-form-item>
                <el-form-item size="mini" label="体检类型">
                  <el-input v-model="messageForm.checktype"></el-input>
                </el-form-item>
                <el-form-item size="mini" label="联系电话">
                  <el-input v-model="messageForm.telephone"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
        </div>
        <div class="avatar">
          <img :src="avatar" alt="" />
        </div>
      </div>
      <!-- 主体表格盒子 -->
      <div class="table_box">
        <el-row>
          <el-col class="t_left" :span="12">
            <div class="t_left_box">
              <div class="title">体检客户</div>
              <div class="printstatus">
                <el-radio-group v-model="printClick" @change="handleRadioChange" size="small">
                  <el-radio-button label="全部"></el-radio-button>
                  <el-radio-button label="未打印"></el-radio-button>
                  <el-radio-button label="已打印"></el-radio-button>
                </el-radio-group>
                <el-radio-group style="margin-left: 20px;" v-model="sendClick" @change="handleRadioChangeSend" size="small">
                  <el-radio-button label="全部"></el-radio-button>
                  <el-radio-button label="未发送"></el-radio-button>
                  <el-radio-button label="已发送"></el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <EasyTable height="100%" :data="customData" class="custom_table" :tableOptions="customOptions" :checkbox-config="{ fetch: true, rowClick: true }" @selected-change="handleChooseCustom" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" row-key="regid" />
            <el-pagination style="text-align: center" :pager-count="5" :small="true" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 300, 500, 1000,2000,3000,4000,5000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
            </el-pagination>
            <!-- <div class="record mt1">记录数：{{ customData.length || 0 }}</div> -->
          </el-col>
          <el-col class="t_right" :span="12">
            <div class="title">
              体检组合
              <div class="record" style="margin-left: 40px; font-size: 14px">
                记录数：{{ combinData.length || 0 }}
              </div>
            </div>
            <EasyTable height="244px" :data="combinData" class="combin_table" :tableOptions="combinOptions" :checkbox-config="{ fetch: true, rowClick: false }" @selected-change="handleSelectCombin" :border="false" row-key="detid" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="handleTableRowColor" :cell-style="{ padding: '0' }" />
            <!-- <div class="record mt1">记录数：{{ combinData.length || 0 }}</div> -->
            <div class="title">
              条码打印
              <div class="record" style="margin-left: 40px; font-size: 14px">
                记录数：{{ barCodeData.length || 0 }}
              </div>
            </div>
            <EasyTable height="244px" :data="barCodeData" class="barCode_table mt1" :tableOptions="barCodeOptions" :checkbox-config="{ fetch: true, rowClick: true }" @selected-change="handleSelectBarCode" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
            <!-- <div class="record mt1">记录数：{{ barCodeData.length || 0 }}</div> -->
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 客户历史体检记录弹框 -->
    <el-dialog class="dialog-mini history_pson" width="55%" height="100%" top="10%" :close-on-click-modal="false" title="历史体检信息" :visible.sync="historyShow" @close="handleCloseHistory">
      <div class="table_box">
        <EasyTable class="table_item" height="100%" row-id="groupid" :data="historySelectData" :tableOptions="historySelectOptions" :radio-config="{ fetch: true, rowClick: true }" @row-dblclick="handleHistoryCheck" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
      </div>
      <div style="text-align: center; margin-top: 15px">
        <el-button size="mini" @click="handleCloseHistory">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 检索组件 -->
    <SearchDialog v-if="showSearch" :showSearch="showSearch" @close="handleCloseSearch" @submit="handleSearchSubmit" />
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import SearchDialog from "@/components/searchDialog";
import { mapGetters } from "vuex";

import {
  getCustomerBarcodeList,
  getCodeDetail,
  getCodeSave,
  getUpdatePrint,
  getCodeDelete,
  BatchDelete,
  getFiles,
  ReportExport,
  batchGenerateBarCode,
  SendApplyForLis,
} from "@/api/customerbarcode.js";
import { getLoadSearchInfo, getBatch } from "@/api/fullsearch.js";
import { printBase64, printStaticsBase64 } from "@/api/printreport.js";
import { getPersonalRegisterList } from "@/api/personalregister.js";
import { getSysConfigInfo } from "@/api/sysconfig";
export default {
  name: "customerbarcode",

  components: { Sticky, permissionBtn, SearchDialog },

  data() {
    return {
      printClick: "全部",
      printstatus: "",
      sendClick: "全部",
      sendstatus: "",
      statusitems: [],
      status: "",
      isEnter: false,
      currentPage: 1, // 当前页
      pageSize: 100, // 页面条数
      count: 0, // 总条数
      test: "",
      switchFlag: false, // 是否同步打印条码
      avatar: require("./images/lin.jpg"),
      deptcode: "", // 当前科室编码
      collectdate: "", // 当前采集时间
      messageForm: {}, // 基本信息筛选条件对象
      customData: [], // 客户体检列表数据
      customDataFilter: [], //
      combinData: [], // 体检组合列表数据
      barCodeData: [], // 条码打印列表数据
      barCodeDataFilter: [], // 条码打印列表数据
      combine: "",
      showSearch: false, // 显示检索组件
      regid: "", // 当前页面登记regid
      departitems: [], // 科室合集
      lockFlag: false, // 是否锁定时间
      selectCombin: [], // 当前选中组合数据
      selectbarCodes: [], // 当前选中条码数据
      barcodeitems: [], // 条码更新合集数据
      codeArr: [],
      condition: "体检号", //检索体检条件
      conditionCode: "regid",
      checkupWork: "", // 检索关键字 1000000080
      checkupCodeArr: [
        { code: "regid", name: "体检号" },
        { code: "name", name: "姓名" },
        { code: "checkno", name: "档案号" },
        { code: "idcard", name: "身份证" },
        { code: "hiscode", name: "门诊卡号" },
        // { code: "name", name: "姓名" },
      ], // 检索条件身份证等数组
      companycode: "",
      companyitems: [],
      batchitems: [],
      groupitems: [], // 团检名称 // 分组选择
      department: [],
      departitem2s: [],
      depart: "",
      depart2: "",
      group: "",
      batch: "",
      historySelectData: [],
      historyShow: false,
      chooseCustom: [],
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 历史信息表格配置
    historySelectOptions() {
      return [
        {
          title: "体检号",
          prop: "regid",
          align: "center",
          width: 110,
        },
        {
          title: "档案号",
          prop: "checkno",
          align: "center",
          width: 110,
        },
        {
          title: "姓名",
          prop: "name",
          align: "center",
        },
        {
          title: "性别",
          prop: "sex",
          align: "center",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
          align: "center",
          returnVal: (value) => {
            return `${value}岁`;
          },
        },
        {
          title: "电话",
          prop: "telephone",
          width: 110,
        },
        {
          title: "身份证号",
          prop: "idcard",
          align: "center",
          width: 175,
          omit: 1,
        },
        {
          title: "团检",
          prop: "companyname",
          align: "center",
          width: 175,
          omit: 1,
        },
        {
          title: "登记时间",
          prop: "regdate",
          align: "center",
          width: 180,
          omit: 1,
        },
      ];
    },
    // 客户体检列表配置
    customOptions() {
      return [
        {
          type: "selection",
          width: 45,
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
          title: "体检号",
          prop: "regid",
          width: 120,
          omit: 1,
        },
        {
          title: "分组",
          prop: "groupname",
          width: 120,
          omit: 1,
        },
        {
          title: "部门",
          prop: "department",
          width: 120,
          omit: 1,
        },
        {
          title: "二级部门",
          prop: "department2",
          width: 120,
          omit: 1,
        },
        {
          title: "档案号",
          prop: "checkno",
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
          title: "预约日期",
          prop: "checkdate",
          width: 150,
          omit: 1,
        },
      ];
    },
    // 体检组合列表配置
    combinOptions() {
      return [
        {
          type: "selection",
          width: 45,
          attrs: { selectable: this.handleSelectHandle },
        },
        {
          title: "体检组合",
          prop: "combinename",
          width: 120,
          omit: 1,
        },
        {
          title: "原价",
          prop: "price",
        },
        {
          title: "折扣",
          prop: "discount",
        },
        {
          title: "折后价格",
          prop: "discountprice",
        },
        {
          title: "缴费",
          prop: "chargeflag",
          enumType: [
            {
              value: 0,
              label: "未收费",
            },
            {
              value: 1,
              label: "已收费",
            },
            {
              value: 2,
              label: "申请退费",
            },
            {
              value: 3,
              label: "已退费",
            },
          ],
        },
        {
          title: "检查科室",
          prop: "deptname",
        },
        {
          title: "开单时间",
          prop: "operatordate",
          width: 120,
          omit: 1,
        },
        {
          title: "检查状态",
          prop: "status",
          returnVal: (value) => {
            return value == 0 ? "登记" : value == "1" ? "弃检" : "完成";
          },
        },
      ];
    },
    // 条码打印列表配置
    barCodeOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "条码号",
          prop: "barcode",
          width: 130,
          omit: 1,
        },
        {
          title: "体检组合",
          prop: "checkname",
          width: 120,
          omit: 1,
        },
        {
          title: "标本类型",
          prop: "samplename",
        },
        {
          title: "容器",
          prop: "containername",
        },
        {
          title: "打印时间",
          prop: "printdate",
          width: 160,
          omit: 1,
        },
        {
          title: "状态",
          prop: "status",
          enumType: [
            {
              value: 0,
              label: "生成",
            },
            {
              value: -1,
              label: "回退",
            },
            {
              value: 1,
              label: "打印",
            },
            {
              value: 2,
              label: "采集",
            },
            {
              value: 3,
              label: "签收",
            },
            {
              value: 4,
              label: "报告",
            },
          ],
        },
        {
          title: "发送状态",
          prop: "sendstatus",
          returnVal: (value) => {
            return value == 0 ? "未发送" : "已发送";
          },
        },
      ];
    },
  },
  mounted() {
    // 页面加载获取当前时间
    this.handleGetToday();
    this.handleGetLoadSearchInfo();
    this.handleFocuscheckupWorkInput();
  },

  methods: {
    handleRadioChangeSend(val) {
      if (val == "全部") {
        this.sendstatus = "";
      } else if (val == "未发送") {
        this.sendstatus = 0;
      } else if (val == "已发送") {
        this.sendstatus = 1;
      }
      this.handleGetCustomerBarcodeList();
    },
    handleRadioChange(val) {
      if (val == "全部") {
        this.printstatus = "";
      } else if (val == "未打印") {
        this.printstatus = 0;
      } else if (val == "已打印") {
        this.printstatus = 1;
      }
      this.handleGetCustomerBarcodeList();
    },
    // 当前改变每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleGetCustomerBarcodeList();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleGetCustomerBarcodeList();
    },
    handleSendApplyForLis() {
      if (this.chooseCustom.length == 0) {
        this.$message.warning("请先勾选发送编码人员!");
        return;
      }
      let data = this.chooseCustom.map((k) => {
        return k.regid;
      });
      const loading = this.$loading({
        lock: true,
        text: "发送中~",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      SendApplyForLis(data)
        .then((res) => {
          this.$message.success(res.message || res.msg);
          this.regid = this.messageForm.regid;
          this.handleGetCodeDetail();
        })
        .finally(() => {
          loading.close();
        });
    },
    handleChangeCombine() {
      if (this.combine) {
        let arr = this.barCodeDataFilter.filter((k) => {
          return k.checkname.includes(this.combine);
        });
        this.barCodeData = arr;
      } else {
        this.barCodeData = this.barCodeDataFilter;
      }
    },
    handleChangeDepartChoose() {
      if (this.depart) {
        let arr = this.customDataFilter.filter((k) => {
          return k.department == this.depart;
        });
        this.customData = arr;
      } else {
        this.customData = this.customDataFilter;
      }
    },
    handleChangeGroup() {
      if (this.group) {
        let arr = this.customDataFilter.filter((k) => {
          return k.groupcode == this.group;
        });
        this.customData = arr;
      } else {
        this.customData = this.customDataFilter;
      }
    },
    handleChangeBatch(value) {
      this.group = "";
      this.depart = "";
      this.handleGetCustomerBarcodeList();
      let index = this.batchitems.filter((k) => {
        return k.code === value;
      });
      if (!index) return;
      this.groupitems = index.groupitems;
      this.department = index.departitems;
      this.departitem2s = index.departitem2s;
    },
    // 批量生成
    handleGenerate() {
      if (this.chooseCustom.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行批量生成!",
          type: "error",
        });
        return false;
      }
      let regidList = this.chooseCustom.map((k) => {
        return k.regid;
      });
      batchGenerateBarCode({
        regidList,
        collectdate: this.collectdate,
      }).then((res) => {
        if (res.result) {
          this.regid = this.chooseCustom[0].regid;
          this.handleGetCodeDetail();
        }
      });
    },
    handleChooseCustom(list) {
      let arr = JSON.parse(JSON.stringify(list));
      this.chooseCustom = arr;
      console.log(this.chooseCustom, "this.chooseCustom");
      if (arr.length == 0) return;
      this.regid = JSON.parse(JSON.stringify(arr[arr.length - 1].regid));
      this.handleGetCodeDetail();
    },
    handleGetCustomerBarcodeList() {
      let whereitems = [];
      if (this.isEnter && this.regid) {
        whereitems.push({
          key: "regid",
          value: this.regid,
        });
      }
      if (this.companycode) {
        whereitems.push({
          key: "companycode",
          value: this.companycode,
        });
      }
      if (this.batch) {
        whereitems.push({
          key: "batch",
          value: this.batch,
        });
      }
      // if (this.group) {
      //   whereitems.push({
      //     key: "group",
      //     value: this.group,
      //   });
      // }
      if (this.group) {
        whereitems.push({
          key: "groupcode",
          value: this.group,
        });
      }
      if (this.depart) {
        whereitems.push({
          key: "department",
          value: this.depart,
        });
      }
      if (this.depart2) {
        whereitems.push({
          key: "department2",
          value: this.depart2,
        });
      }
      if (this.status) {
        whereitems.push({
          key: "status",
          value: this.status,
        });
      }
      if (this.printstatus !== "") {
        whereitems.push({
          key: "printstatus",
          value: this.printstatus,
        });
      }
      if (this.sendstatus !== "") {
        whereitems.push({
          key: "sendstatus",
          value: this.sendstatus,
        });
      }
      getCustomerBarcodeList({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      }).then((res) => {
        if (res.data.length == 0) {
          this.customData = [];
        } else {
          this.customData = res.data;
          this.count = res.count;
          this.customDataFilter = res.data;
          this.regid = res.data[0].regid;
          this.handleGetCodeDetail();
          this.combinData = [];
          this.barCodeData = [];
          this.barCodeDataFilter = [];
        }
      });
    },
    // 历史人员双击回调
    handleHistoryCheck(row) {
      if (!row) return false;
      this.condition = "体检号";
      this.conditionCode = "regid";
      this.regid = row.regid;
      this.handleGetCustomerBarcodeList(); // 查询信息
      this.handleCloseHistory(); // 关闭弹框
    },
    // 历史信息表格选中人员关闭
    handleCloseHistory() {
      this.historyShow = false;
      this.historySelectData = [];
    },
    // 输入检索身份证/条件号等回调
    handleInputWork() {
      this.isEnter = true;
      if (!this.regid) {
        this.$message.warning("请输入查找信息!");
        return false;
      }
      if (this.conditionCode === "regid") {
        this.handleGetCustomerBarcodeList();
      } else {
        getPersonalRegisterList({
          page: 1,
          limit: 10000,
          whereitems: [
            {
              key: this.conditionCode,
              value: this.regid,
            },
            {
              key: "pageflag",
              value: "customerresult",
            },
          ],
        }).then((res) => {
          if (!res.data) return;
          if (res.data.length == 1) {
            this.regid = res.data[0].regid;
            this.handleGetCustomerBarcodeList();
          } else if (res.data.length > 1) {
            this.historySelectData = res.data;
            this.historyShow = true;
            this.regid = "";
          }
        });
      }
    },
    // 选择单位请求批次号回调
    handleGetBatch() {
      getBatch({ companycode: this.companycode }).then((res) => {
        this.batch = ""; // 重置批次号
        let { batchitems } = res.result;
        this.batchitems = batchitems;
        let selectIndex = batchitems.findIndex((k) => k.selected);
        if (selectIndex > -1) {
          console.log(batchitems[selectIndex]);
          this.batch = batchitems[selectIndex].code;
          this.groupitems = batchitems[selectIndex].groupitems;
          this.department = batchitems[selectIndex].departitems;
          this.departitem2s = batchitems[selectIndex].departitem2s;
        }
        this.handleGetCustomerBarcodeList();
      });
    },
    // 单位下拉列表改变值触发回调
    handleChangeCompany(val) {
      if (!val) return;
      this.batch = "";
      this.handleGetBatch();
    },
    // 加载搜索条件返回合集回调
    handleGetLoadSearchInfo() {
      getLoadSearchInfo().then((res) => {
        let { companyitems, statusitems } = res.result;
        this.companyitems = companyitems; // 公司集合
        this.statusitems = statusitems; // 状态集合
        let status = statusitems.filter((k) => k.selected)[0];
        status && (this.status = status.code);
      });
    },
    // 获取光标到检索框
    handleFocuscheckupWorkInput() {
      this.$nextTick(() => {
        this.$refs.checkupWorkInput.focus();
      });
    },
    // 点击选择检索体检条件回调
    handleSelectCondition(val) {
      this.regid = "";
      this.condition = val.name;
      this.conditionCode = val.code;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
      this.handleFocuscheckupWorkInput();
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
    handleTableRowColor({ row, rowIndex }) {
      let rowBackground = {};
      if (row.barcode) {
        rowBackground.background = "rgba(0, 255, 255, 0.5)";
        return rowBackground;
      }
    },
    // 批量删除回调
    handleBatchDel() {
      if (this.chooseCustom.length == 0) {
        this.$message.warning("请勾选需要删除的人员条码数据!");
        return false;
      }
      this.$confirm("此操作将删除条码数据且无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let regiditems = this.chooseCustom.map((k) => {
            return k.regid;
          });
          BatchDelete({ regiditems }).then((res) => {
            this.$message.success(res.message);
            this.handleGetCustomerBarcodeList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 条码删除回调
    handleGetCodeDelete() {
      if (this.selectbarCodes.length == 0) {
        this.$message.warning("请勾选需要删除的条码数据!");
        return false;
      }
      if (!this.messageForm.regid) {
        this.$message.warning("请选中需要删除的人员条码数据!");
        return false;
      }
      let barcodeitems = this.selectbarCodes.map((k) => {
        return k.barcode;
      });
      getCodeDelete({
        regid: this.regid || this.messageForm.regid,
        barcodeitems,
      }).then((res) => {
        this.$message.success(res.message);
        this.regid = this.messageForm.regid;

        this.handleGetCodeDetail();
      });
    },
    // 条码更新回调
    handleGetUpdatePrint(barcode, flag = true) {
      getUpdatePrint({
        regid: this.regid || this.messageForm.regid,
        barcodeitems: [barcode],
      }).then((res) => {
        this.$message.success(res.message);
        this.regid = regid || this.regid;
        flag && this.handleGetCodeDetail();
      });
    },
    // 筛选禁用数据
    handleSelectHandle(row, index) {
      if (!row.barcode) {
        return true; //禁用
      } else {
        return false; //不禁用
      }
    },
    // 点击生成条码回调
    handleGetCodeSave() {
      if (this.selectCombin.length == 0) {
        this.$message.warning("请先勾选体检组合数据!");
        return false;
      }
      if (!this.lockFlag) this.handleGetToday();
      getCodeSave({
        regid: this.regid || this.messageForm.regid,
        deptcode: this.deptcode,
        collectdate: this.collectdate,
        combineitems: this.selectCombin,
      }).then((res) => {
        this.barcodeitems = res.result;
        this.$message.success(res.message);
        this.handleGetCodeDetail();
        // this.handleGetUpdatePrint(this.regid || this.messageForm.regid, true);
      });
    },
    // 点击锁定时间回调
    handleLockTime() {
      this.lockFlag = !this.lockFlag;
      if (this.lockFlag) this.handleGetToday();
    },
    // 获取当前年月日时分秒回调
    handleGetToday() {
      this.collectdate = new Date(+new Date() + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 19)
        .replace("T", " ");
    },
    // 科室筛选改变回调
    handleChangeDepart(depart) {
      if (this.combinData.length == 0) return false;
      if (!depart) {
        this.combinData = JSON.parse(
          JSON.stringify(this.messageForm.combineitems)
        );
      } else {
        this.combinData = this.messageForm.combineitems.filter((k) => {
          return k.deptcode == depart;
        });
      }
    },
    // 获取条码详情回调
    handleGetCodeDetail() {
      let regid = this.regid || this.messageForm.regid;
      if (!regid.trim()) {
        this.$message.warning("请先填写体检号!");
        return false;
      }
      getCodeDetail({ regid }).then((res) => {
        this.handleSelectCustom(res.result);
        this.messageForm = res.result;
        let data = res.result;
        this.messageForm.sexs =
          data.sex == 0 ? "未知" : data.sex == 1 ? "男" : "女";
        this.departitems = data.departitems;

        if (this.messageForm.fileid) {
          this.handleGetFiles();
        } else {
          this.avatar = require("./images/lin.jpg");
        }
        this.regid = "";
      });
    },
    // 检索组件显示回调
    handleShowSearch() {
      this.showSearch = true;
    },
    // 检索组件关闭回调
    handleCloseSearch(value) {
      this.showSearch = value;
    },
    // 检索组件提交回调
    handleSearchSubmit(regid) {
      this.regid = regid;
      this.handleGetCodeDetail();
    },
    // 点击选中客户数据回调
    handleSelectCustom(row) {
      this.regid = row.regid;
      this.combinData = JSON.parse(JSON.stringify(row.combineitems));
      let temp = JSON.parse(JSON.stringify(row.barcodeitems));
      this.barCodeData = temp.filter((k) => {
        return k.checkname.includes(this.combine);
      });
      this.barCodeDataFilter = JSON.parse(JSON.stringify(row.barcodeitems));
    },
    // 点击选中体检组合数据回调
    handleSelectCombin(rows) {
      this.selectCombin = rows;
    },
    // 点击选中条码打印数据回调
    handleSelectBarCode(rows) {
      this.selectbarCodes = rows;
      this.codeArr = this.selectbarCodes.map((i) => {
        return i.barcode;
      });
    },
    // id获取文件回调
    handleGetFiles() {
      getFiles({ Id: this.messageForm.fileid }).then((res) => {
        this.avatar = res.result.fileUrl;
      });
    },
    // 批量打印
    handleBatchPrinting() {
      if (this.chooseCustom.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行批量打印!",
          type: "error",
        });
        return false;
      }
      // 1000006194
      this.$refs.permissionBtn.$children.forEach(async (k, i) => {
        if (k.$el.innerText === "批量打印") {
          this.chooseCustom = this.chooseCustom.sort(function (a, b) {
            return a.seqno - b.seqno;
          });
          for (let i = 0; i < this.chooseCustom.length; i++) {
            await this.handleBatchPrintingApi(
              this.chooseCustom[i],
              k.$attrs["data-remark"]
            );
          }
          // this.chooseCustom.forEach((item) => {
          // });
        }
      });
    },
    handleBatchPrintingApi(item, repname) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [item.regid],
            repname,
            // repname: k.$attrs["data-remark"],
            whereitems: [],
            printflag: 1,
            reporttype: "Barcode",
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
            this.handleGetUpdatePrint(item.regid, false);
            return resolve("ok");
          });
        } catch (err) {
          return reject(err);
        }
      });
    },
    // 条码打印
    handlePrintBarcode() {
      if (this.codeArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请先选中需打印条码再进行条码打印",
          type: "error",
        });
        return false;
      }
      // 1000006194
      this.$refs.permissionBtn.$children.forEach(async (k, i) => {
        if (k.$el.innerText === "条码打印") {
          this.codeArr = this.codeArr.sort(function (a, b) {
            return a.seqno - b.seqno;
          });
          for (let i = 0; i < this.codeArr.length; i++) {
            let res = await this.handlePrintBarcodeApi(
              this.codeArr[i],
              k.$attrs["data-remark"]
            );
            this.handleGetUpdatePrint(this.codeArr[i], false);
          }
        }
      });
    },
    handlePrintBarcodeApi(item, repname) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [this.regid || this.messageForm.regid],
            repname,
            // repname: k.$attrs["data-remark"],
            whereitems: [
              {
                key: "barcode",
                value: item,
              },
            ],
            printflag: 1,
            reporttype: "Barcode",
          };
          printStaticsBase64(data).then((res) => {
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
            this.lodop.On_Return = function (TaskID, Value) {};
            return resolve("ok");
          });
        } catch (err) {
          console.log(err);
          return reject(err);
        }
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
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      //   console.log(domId);
      switch (domId) {
        case "btnSearch": // 查询
          this.handleShowSearch();
          break;
        case "btnConfirm": // 条码确认
          console.log(domId);
          this.handleGetCodeSave();
          break;
        case "btnBarcodePrinting": // 条码打印
          this.handlePrintBarcode();
          break;
        case "btnBatchPrinting": // 批量打印
          this.handleBatchPrinting();
          break;
        case "btnCodeDel": // 条码删除
          this.handleGetCodeDelete();
          break;
        case "btnReset": // 重置
          this.$reload();
          break;
        case "btnGenerate": // 批量生成
          this.handleGenerate();
          break;
        case "btnBatchDel": // 批量删除
          this.handleBatchDel();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnSendCode": // 发送
          this.handleSendApplyForLis();
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
.head_box {
  height: 230px !important;
}
.table_box {
  height: calc(100% - 230px);
}
.checkno_box {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
  .checkno {
    width: 100%;
    display: flex;
    align-items: center;
    /deep/.el-input {
      width: 100%;
      margin: 0 10px 0 10px;
    }
    .select_box {
      display: flex;
      width: 280px !important;
      .form_label {
        width: 90px !important;
        text-align: right;
        flex-shrink: 0;
      }
      .el-select,
      .el-input {
        width: 100% !important;
      }
      .el-select {
        .el-input {
          width: 100% !important;
        }
      }
    }
  }
  .switch {
    margin-left: 50px;
    display: flex;
    align-items: center;
  }
}
// .checkno_box {
//   flex-direction: column;
//   .checkno {
//     .select_box {
//       width: 280px !important;
//       .form_label {
//         width: 90px !important;
//       }
//       .el-select,
//       .el-input {
//         width: 100% !important;
//       }
//       .el-select {
//         .el-input {
//           width: 100% !important;
//         }
//       }
//     }
//   }
// }
</style>