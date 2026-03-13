<template>
  <div class="full_search" v-loading="loadPage" element-loading-text="正在下载,请稍后" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- 头部操作控件 -->
    <!-- <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn moduleName="fullsearch" ref="fullsearch" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
        <el-popover class="print_box" placement="bottom" trigger="click">
          <el-button class="print_btn" size="mini" slot="reference" type="primary">打印预览</el-button>
          <div class="print_item" v-for="(item,index) in printArr" :key="index">{{item.name}}</div>
        </el-popover>
      </div>
    </sticky> -->
    <div class="filter-container">
      <div v-for="(btn, index) of buttons" :key="index">
        <el-popover ref="popoverRefIdc" v-if="domIdArr.includes(btn.domId)" class="print_box" placement="bottom" trigger="click">
          <el-button type="primary" plain slot="reference" :size="size" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" class="filter-item"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
          <div class="print_item" v-if="btn.domId != 'btnViewReoprtFlag'" @click="hadnleOnBtnClicked(btn.domId)">
            打印
          </div>
          <div class="print_item" v-if="btn.domId != 'btnViewReoprtFlag'" @click="handlePreview(btn.domId)">
            预览
          </div>
          <div class="print_item" v-if="btn.domId == 'btnViewReoprtFlag'" @click="handleSetViewReoprtFlag(1)">
            确定
          </div>
          <div class="print_item" v-if="btn.domId == 'btnViewReoprtFlag'" @click="handleSetViewReoprtFlag(0)">
            取消
          </div>
          <div class="print_item" v-if="btn.name == '报告书'" @click="handleSelectPrint(btn.domId)">
            选页打印
          </div>
        </el-popover>
        <el-button type="primary" plain v-else :size="size" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" class="filter-item" @click="hadnleOnBtnClicked(btn.domId)"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
      </div>
    </div>
    <!-- 主体内容区域 -->
    <div class="subject">
      <el-row class="bg_white">
        <!-- 左侧查询条件 -->
        <el-col class="form_box" :span="6">
          <div class="head">
            <div class="logo"></div>
            <div class="head_text">检索条件</div>
            <!-- <el-switch
              style="margin-left: 30px"
              v-model="autoPrintReport"
              active-color="#13ce66"
              inactive-color="#909399"
              active-text="打印报告书"
            >
            </el-switch> -->
          </div>
          <el-form ref="form" :model="searchForm">
            <el-form-item class="input" size="mini">
              <div class="form_label">体检号</div>
              <el-input size="mini" clearable ref="checkupWorkInput" @clear="handleSearchPageTable" v-model="searchForm.regid" placeholder="请输入体检号" @keyup.native.enter="handleEnterRegid"></el-input>
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">姓名</div>
              <el-input v-model="searchForm.name" clearable @clear="handleSearchPageTable" @keyup.native.enter="handleSearchPageTable"></el-input>
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">体检时间</div>
              <el-date-picker @change="handleChangeDate" @clear="handleSearchPageTable" size="mini" v-model="conditionDate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">单位名称</div>
              <el-select v-model="searchForm.companycode" clearable filterable @change="handleChangeCompany">
                <el-option v-for="(item, index) in companyitems" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">批次</div>
              <el-select v-model="searchForm.batch" clearable @change="handleSearchPageTable">
                <el-option v-for="(item, index) in batchitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">单位分组</div>
              <el-select v-model="searchForm.groupcode" clearable filterable @change="handleChangeGroup">
                <el-option v-for="(item, index) in groupitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 右侧表格展示数据 -->
        <el-col class="table_box" :span="18">
          <div class="head">
            <div class="logo"></div>
            报表预览
          </div>
          <!-- <EasyTable
            row-id="regid"
            ref="pageTable"
            class="page_table"
            height="100%"
            :data="pageData"
            :tableOptions="pageOptions"
            :checkbox-config="{ rowClick: true, fetchVal: true }"
            @selected-change="handleSelectPeople"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :row-style="{ height: '32px' }"
            :cell-style="{ padding: '0' }"
          /> -->
          <div class="page_table">
            <vxe-table ref="pageTable" height="auto" border="inner" :loading="loading" highlight-hover-row :data="pageData" :sort-config="{ trigger: 'cell' }" @checkbox-change="handleSelectPeople" @checkbox-all="handleSelectPeopleAll" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" row-id="regid">
              <vxe-table-column type="checkbox" width="40px" :reserve-selection="true"></vxe-table-column>
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
              <vxe-table-column field="groupname" title="分组名" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="companyname" title="单位" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="status" title="总检状态" min-width="80px" show-header-overflow show-overflow="title" show-footer-overflow>
                <template v-slot="{ row }">
                  <div v-if="row.status >= 6">已总检</div>
                  <div v-else>未总检</div>
                </template>
              </vxe-table-column>
              <vxe-table-column field="telephone" title="手机号" width="150px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="idcard" title="身份证号" min-width="200px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="regdate" title="登记日期" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="checkdate" title="体检日期" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            </vxe-table>
          </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 1000, 5000, 10000, 50000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <!-- 预览弹框 -->
    <el-dialog title="预览" class="preview_box" :visible.sync="dialogVisible" width="700px" @close="handleCloseDialog">
      <iframe ref="pdfCotainer" :src="pdfUrl" width="100%" style="height: calc(100vh - 147px)"></iframe>
    </el-dialog>
    <el-dialog title="选页打印" :visible.sync="showSelectPrint" width="40%" class="selectPrint_dia" :close-on-click-modal="false" :show-close="false">
      <div class="input_box">
        打印页码：<el-input v-model="selectPrintStart" clearable size="mini">
        </el-input>　-　<el-input v-model="selectPrintEnt" clearable size="mini">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="
            (showSelectPrint = false),
              (selectPrintStart = ''),
              (selectPrintEnt = '')
          ">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSelectPrintDia">打 印</el-button>
      </span>
    </el-dialog>
    <!-- 导出控制 -->
    <el-dialog title="导出控制" :visible.sync="showExportControl" width="50%" :show-close="false" :close-on-click-modal="false" class="exportcontrol_dia">
      <div class="eccontent">
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="item.value" v-for="item in exportField" :key="item.value">{{ item.key }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showExportControl = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleConfirmExpor">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { printBase64, printStaticsBase64 } from "@/api/printreport.js";
import * as Sys_ConfiguringPrinters from "@/api/Sys_ConfiguringPrinters";

import { jumpRouteLink } from "@/utils/jumpRouteLink.js"; // 跳转页面进入路由缓存
import {
  getLoadSearchInfo,
  getBatch,
  getPageList,
  getExportFile,
  ReportExport,
  DownloadHead,
  Delete,
  SetViewReoprtFlag,
} from "@/api/fullsearch.js";
import {
  CustomerResultExportLoad,
  CustomerResultExportExport,
} from "@/api/dataexport.js";
// 引入页面接口
import { getPersonalDetail } from "@/api/personalregister.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import { mapGetters } from "vuex";
import { getToken, getLicenseKey } from "@/utils/auth";

export default {
  name: "fullsearch",

  components: { Sticky, permissionBtn },
  props: {
    size: {
      type: String,
      default: "mini",
    },
  },
  data() {
    return {
      cardReaderFlag: "新中新", // 读卡器品牌 华视 精伦 新中新
      autoPrintReport: false,
      autoPhysique: false,
      selectPrintStart: "",
      selectPrintEnt: "",
      showSelectPrint: false,
      chooseArr: [],
      searchForm: {
        regid: "",
        idcard: "",
        hiscode: "",
        checkno: "",
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
        reporttype: "",
        reportprintflag: "",
      }, // 检索条件表单
      condition: "档案号", //检索体检条件
      conditionCode: "checkno",
      checkupWork: "", // 检索关键字
      conditionDate: "", //检索体检日期
      loading: false,
      checkupCodeArr: [
        { code: "checkno", name: "档案号" },
        { code: "idcard", name: "身份证" },
        { code: "hiscode", name: "门诊卡号" },
        { code: "name", name: "姓名" },
      ], // 检索条件身份证等数组
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
      pageData: [], // 主页表格列表人员数据
      meccodeitems: [], // 体检中心集合
      companyitems: [], // 公司集合
      batchitems: [], // 批次集合
      departitems: [], // 批次集合
      departitem2s: [], // 批次集合
      downloadList: [], // 图片下载合集
      groupitems: [], // 组合集合
      statusitems: [], // 状态集合
      reporttypeitems: [], // 报告类型集合
      selectArr: [], // 表格选中人员
      loddp: "",
      printArr: [
        {
          name: "指引单",
          flag: "btnGuide",
        },
        {
          name: "缴费单",
          flag: "btnPaySingle",
        },
        {
          name: "标签单",
          flag: "btnLabel",
        },
        {
          name: "条码单",
          flag: "btnBarCode",
        },
        {
          name: "报告书",
          flag: "btnReport",
        },
        {
          name: "体格检查表",
          flag: "btnPhysique",
        },
      ], // 打印预览列表
      buttons: [],
      domIdArr: [
        "btnGuide",
        "btnPaySingle",
        "btnLabel",
        "btnBarCode",
        "btnReport",
        "btnPhysique",
        "btnViewReoprtFlag",
      ],
      dialogVisible: false, // 预览弹框显示
      pdfUrl: "",
      dataSources: "",
      currentPage: 1,
      pageSize: 100,
      count: 0,
      checktypeitems: [],
      isEnterRegid: false,
      meccodes: "", //meccode(院区标识）判断为1，报告书报表调用‘高干报告书’模版
      showExportControl: false,
      exportField: [
        { key: "登记ID", value: "regid" },
        { key: "体检中心", value: "meccode" },
        { key: "登记日期", value: "regdate" },
        { key: "体检号", value: "checkno" },
        { key: "健康卡号", value: "healthcard" },
        { key: "姓名", value: "name" },
        { key: "性别", value: "sex" },
        { key: "年龄", value: "age" },
        { key: "出生日期", value: "birthday" },
        { key: "婚否", value: "marriage" },
        { key: "民族", value: "nation" },
        { key: "籍贯", value: "nativeplace" },
        { key: "职业", value: "occupation" },
        { key: "联系电话", value: "telephone" },
        { key: "邮箱", value: "email" },
        { key: "地址", value: "address" },
        { key: "身份证号", value: "idcard" },
        { key: "his编码", value: "hiscode" },
        { key: "所属部门", value: "department" },
        { key: "级别", value: "level" },
        { key: "检查类型", value: "checktype" },
        { key: "单位编码", value: "companycode" },
        { key: "单位名称", value: "companyname" },
        { key: "批次", value: "batch" },
        { key: "分组编码", value: "groupcode" },
        { key: "分组名称", value: "groupname" },
        { key: "体检时间", value: "checkdate" },
        { key: "排序", value: "seqno" },
        { key: "订单号", value: "ordercode" },
        { key: "身份证类型", value: "idtype" },
        { key: "医疗证", value: "medicalcertify" },
        { key: "在职情况", value: "jobin" },
        { key: "任职情况", value: "positionin" },
        { key: "预约时间", value: "registerdate" },
        { key: "二级部门", value: "department2" },
        { key: "三级部门", value: "department3" },
        { key: "四级部门", value: "department4" },
      ], // 导出字典渲染
      checkList: [], // 选中导出的字段
      baseConfigUrl: "",
      loadPage: false,
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),

    // 主页表格列表人员数据
    pageOptions() {
      return [
        {
          type: "selection",
          width: 45,
          align: "center",
        },
        {
          title: "体检号",
          prop: "regid",
          width: 120,
          align: "center",
          omit: 1,
        },
        {
          title: "姓名",
          prop: "name",
          width: 85,
          align: "center",
          omit: 1,
        },
        {
          title: "性别",
          prop: "sex",
          width: 85,
          align: "center",
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
          width: 85,
          omit: 1,
          align: "center",
          returnVal: (value) => {
            return `${value}  岁`;
          },
        },
        {
          title: "手机号",
          omit: 1,
          width: 150,
          prop: "telephone",
          align: "center",
        },
        {
          title: "身份证号",
          omit: 1,
          prop: "idcard",
          align: "center",
        },
        {
          title: "团检",
          omit: 1,
          prop: "companyname",
          width: 180,
          align: "center",
        },
        {
          title: "状态",
          width: 85,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>已登记</span>
                <span v-show={data.status == 1}>已预约</span>
                <span v-show={data.status == 2}>已签到</span>
                <span v-show={data.status == 3}>体检中</span>
                <span v-show={data.status == 4}>已交表</span>
                <span v-show={data.status == 5}>可总检</span>
                <span v-show={data.status == 6}>已总检</span>
                <span class="fontRed" v-show={data.status == 7}>
                  已审核
                </span>
              </div>
            );
          },
        },
        {
          title: "操作",
          width: 200,
          omit: 1,
          render: (h, data) => {
            return (
              <div style="width:100%;display: flex;justify-content: space-around;">
                {data.operateitems.map((item, index) => {
                  let style =
                    index == 0 ? "primary" : index == 1 ? "warning" : "success";
                  return (
                    <el-link
                      type={style}
                      vOn:click_stop_prevent={() =>
                        this.handleJumpPage(data, item)
                      }
                    >
                      {item.name}
                    </el-link>
                  );
                })}
              </div>
            );
          },
        },
      ];
    },
  },

  mounted() {
    //   页面加载 加载搜索条件集
    this.handleGetLoadSearchInfo();
    this.handleGetPrintConfig();
    // 获取按钮组数据
    let elements = this.$route.meta.elements;
    this.buttons = elements.sort((a, b) => {
      return a.sort - b.sort;
    });
    getPersonalDetail().then((res) => {
      if (!res.result) return;
      this.checktypeitems = res.result.checktypeitems;
    });
    getSysConfigInfo({ cc: "Sys_System_Api" }).then((res) => {
      if (!res.result) return;
      this.baseConfigUrl = res.result;
    });
    this.handleGetPrintDate();
    this.handleFocuscheckupWorkInput();
  },

  methods: {
    handleConfirmExpor() {
      this.showExportControl = false;
    },
    // 导出表格
    handleExportExcel() {
      if (this.checkList.length == 0) {
        this.$message.warning(
          "导出表格字段不允许为空!请先打开导出控制勾选数据!"
        );
        return;
      }
      console.log(this.checkList);
      let temp = this.exportField
        .filter((k) => {
          return this.checkList.includes(k.value);
        })
        .map((k) => k.value);
      let whereitems = [
        {
          key: "exportfield",
          value: temp.join(","),
        },
      ];
      Object.keys(this.searchForm).forEach((item) => {
        if (this.searchForm[item]) {
          whereitems.push({
            key: item,
            value: this.searchForm[item],
          });
        }
      });
      this.loadPage = true;
      let url = `${this.baseConfigUrl}/CustomerResultExport/Export`;
      this.$axios
        .post(
          url,
          {
            whereitems,
          },
          {
            headers: {
              "X-Token": getToken(),
              "LICENSE-KEY": getLicenseKey(),
            },
          }
        )
        .then((res) => {
          this.loadPage = false;
          let data = res.data;
          if (data.code == 200 && data.result) {
            const link = document.createElement("a"); //创建下载a标签
            link.href = data.result;
            link.style.display = "none"; //默认隐藏元素
            document.body.appendChild(link); // body中添加元素
            link.click(); // 执行点击事件
            document.body.removeChild(link); //下载完成后移除元素
          }
        })
        .catch((err) => {
          this.loadPage = false;
          console.log(err);
        });
      // CustomerResultExportExport({ whereitems }).then((res) => {
      //   const link = document.createElement("a"); //创建下载a标签
      //   link.href = res.result;
      //   link.style.display = "none"; //默认隐藏元素
      //   document.body.appendChild(link); // body中添加元素
      //   link.click(); // 执行点击事件
      //   document.body.removeChild(link); //下载完成后移除元素
      // });
    },
    handleExportControl() {
      this.showExportControl = true;
    },
    // 查看报告回调
    handleSetViewReoprtFlag(viewreoprtflag) {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      if (this.chooseArr.length == 0) {
        this.$message.warning("请先选中需操作人员!");
        return;
      }
      SetViewReoprtFlag({
        regiditems: this.chooseArr,
        viewreoprtflag,
      }).then((res) => {
        this.$message.success(res.message);
        this.handleSearchPageTable();
      });
    },
    /* 获取打印配置 */
    handleGetPrintConfig() {
      var data = {
        id: localStorage.getItem("md5code"),
      };
      Sys_ConfiguringPrinters.getList(data).then((res) => {
        if (!res.result) return;
        let flag = res.result.filter((k) => {
          return k.printtype === "idcarddev";
        })[0];
        if (!flag) return;
        this.cardReaderFlag = flag.printname;
      });
    },
    /* 读卡快速搜索 */
    handleSearchCardReading() {
      this.conditionCode = "idcard";
      if (this.cardReaderFlag == "华视") {
        this.handleConnectIdcard();
        let url = `http://127.0.0.1:19196/readcard&picpath=D:/1/123.bmp&t=${Math.random()}`;
        this.$axios
          .get(url)
          .then(async (res) => {
            if (res.data.resultFlag == 0) {
              let data = res.data;
              this.searchForm.idcard = data.certNumber;
              this.handleSearchPageTable();
            } else {
              this.$message.warning(res.data.errorMsg);
            }
          })
          .catch((err) => {
            this.$message.warning(err);
          });
      } else if (this.cardReaderFlag == "精伦") {
        let url = `http://127.0.0.1:18889/api/readCert`;
        this.$axios
          .get(url)
          .then(async (res) => {
            if (res.data.resultFlag == 0) {
              let data = res.data.resultContent;
              this.searchForm.idcard = data.certNumber;
              this.handleSearchPageTable();
            } else {
              this.$message.warning(res.data.errorMsg);
            }
          })
          .catch((err) => {
            this.$message.warning(err);
          });
      } else if (
        this.cardReaderFlag == "新中新" ||
        this.cardReaderFlag == "中控"
      ) {
        let url = `http://localhost:8989/api/ReadMsg?waitTime=3`;
        this.$axios
          .get(url)
          .then(async (res) => {
            if (res.data) {
              let data = res.data;
              this.searchForm.idcard = data.cardno;
              this.handleSearchPageTable();
            } else {
              this.$message.warning(`${res.data.retmsg}，请联系管理员!`);
            }
          })
          .catch((err) => {
            this.$message.warning(err);
          });
      }
    },
    // 删除人员回调
    handleDeletePersonnel() {
      if (this.downloadList.length == 0) {
        this.$message.warning("请先勾选操作数据!");
        return;
      }
      this.$confirm("此操作将删除当前勾选人员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        distinguishCancelAndClose: true,
        showClose: false,
        closeOnClickModal: false,
        type: "warning",
      })
        .then((status) => {
          if (status == "confirm") {
            let delArr = this.downloadList.filter((k) => {
              return k.status < 3 && k.chargeflag == 0;
            });
            if (delArr.length == 0) return;
            let regids = delArr.map((k) => {
              return k.regid;
            });
            Delete(regids).then((res) => {
              this.$message.success(res.message);
              this.handleSearchPageTable();
            });
          }
        })
        .catch((status) => {
          if (status == "cancel") {
            this.$message({
              type: "info",
              message: "已取消",
            });
          }
        });
    },
    // 报告书选页打印
    handleSelectPrint() {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行打印",
          type: "error",
        });
        return false;
      }
      if (this.selectArr.length > 1) {
        this.$message({
          showClose: true,
          message: "只支持单个人员",
          type: "error",
        });
        return false;
      }
      let flag = this.selectArr[0];
      if (!flag) return;
      if (flag.status < 7) {
        this.$confirm("该用户暂未审核不允许打印!", "提示", {
          confirmButtonText: "是",
          distinguishCancelAndClose: true,
          showClose: false,
          showCancelButton: false,
          closeOnClickModal: false,
          type: "warning",
        })
          .then((status) => {})
          .catch((status) => {});
        return;
        this.$confirm("该用户还未总检, 是否继续打印?", "提示", {
          confirmButtonText: "打印",
          cancelButtonText: "不打印",
          distinguishCancelAndClose: true,
          showClose: false,
          closeOnClickModal: false,
          type: "warning",
        })
          .then((status) => {
            if (status == "confirm") {
              this.handlePrintReport();
            }
          })
          .catch((status) => {
            if (status == "cancel") {
              this.$message({
                type: "info",
                message: "已取消打印",
              });
            }
          });
      } else if (flag.reportprintflag == 1) {
        this.$confirm("该用户已经打印, 是否继续打印?", "提示", {
          confirmButtonText: "打印",
          cancelButtonText: "不打印",
          distinguishCancelAndClose: true,
          showClose: false,
          closeOnClickModal: false,
          type: "warning",
        })
          .then((status) => {
            if (status == "confirm") {
              this.handlePrintReport();
            }
          })
          .catch((status) => {
            if (status == "cancel") {
              this.$message({
                type: "info",
                message: "已取消打印",
              });
            }
          });
      } else if (flag.status == 7) {
        this.handlePrintReport();
      }
      this.showSelectPrint = true;
      return;
    },
    // 选页打印
    handleSelectPrintDia() {
      if (!this.selectPrintStart || !this.selectPrintEnt) {
        this.$message.warning("请先填写需打印页!");
        return;
      }
      if (+this.selectPrintStart > +this.selectPrintEnt) {
        this.$message.warning("起始页不能大于终止页!");
        return;
      }
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$children[0].$el.innerText == "报告书") {
          let index = this.pageData.findIndex((k) => {
            return k.regid == this.chooseArr[0];
          });
          let indexP =
            d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
          let repname = "";
          if (
            this.pageData[index].meccode == 0 &&
            this.pageData[index].companytype.toLowerCase().indexOf("vip") > -1
          ) {
            if (this.pageData[index].checktype == "1") {
              repname = `${indexP}报告书`;
            } else if (this.pageData[index].checktype == "2") {
              repname = `${indexP}入职报告书`;
            } else {
              repname = `${indexP}团体报告书`;
            }
          } else if (index != -1 && this.pageData[index].meccode == 1) {
            repname = `${indexP}高干报告书`;
          } else if (this.pageData[index].meccode == 3) {
            repname = `${indexP}番禺报告书`;
          } else {
            if (this.pageData[index].personalflag == 1) {
              repname = `${indexP}团体报告书`;
            } else {
              if (this.pageData[index].checktype == 2) {
                repname = `${indexP}入职报告书`;
              } else {
                repname = d.$children[0].$attrs["data-remark"];
              }
            }
          }
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: this.selectArr,
            repname,
            // repname: d.$children[0].$attrs["data-remark"],
            printflag: 1,
            whereitems: [],
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
            this.lodop.SET_PRINT_MODE(
              "PRINT_START_PAGE",
              +this.selectPrintStart
            ); // 设置从第2页开始打印;
            this.lodop.SET_PRINT_MODE("PRINT_END_PAGE", +this.selectPrintEnt); // 设置从第3页结束打印;
            printObj.printBase64PdfReport(this.lodop, fileList);
            this.showSelectPrint = false;
            this.selectPrintStart = "";
            this.selectPrintEnt = "";
          });
        }
      });
    },
    // 获取光标到检索框
    handleFocuscheckupWorkInput() {
      this.$nextTick(() => {
        this.$refs.checkupWorkInput.focus();
      });
    },
    handleEnterRegid() {
      this.isEnterRegid = true;
      this.currentPage = 1;
      this.handleSearchPageTable();
    },
    // 下载照片压缩包
    handleDownloadHead() {
      console.log(this.downloadList, "this.downloadList");
      if (this.downloadList.length == 0) {
        this.$message.warning("请勾选需要导出照片人员!");
        return;
      }
      /**
       * 文件id|姓名|体检号
       * [文件id|姓名|体检号,文件id|姓名|体检号,文件id|姓名|体检号]
       * fileid|name|regid
       *  */
      let dlList = [];
      let messageStr = "";
      this.downloadList.forEach((k) => {
        if (k.fileid) {
          dlList.push(`${k.fileid}|${k.name}|${k.regid}`);
        } else {
          messageStr += `${k.name}，`;
        }
      });
      if (dlList.length == 0) return;
      if (messageStr != "") {
        this.$message.warning(`${messageStr}暂无照片!`);
      }
      DownloadHead(dlList).then((res) => {
        console.log(res);
        const link = document.createElement("a"); //创建下载a标签
        link.href = res.result;
        link.style.display = "none"; // 默认隐藏元素
        document.body.appendChild(link); // body中添加元素
        link.click(); // 执行点击事件
        document.body.removeChild(link); //下载完成后移除元素
      });
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
    handleGetPrintDate() {
      getSysConfigInfo({ cc: "Sys_FullSearch_DateRange" }).then((res) => {
        // 获取条件计算日期范围回调
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
        this.conditionDate = [this.gettime(start), this.gettime(end)];
        this.searchForm.startdate = this.gettime(start);
        this.searchForm.enddate = this.gettime(end);
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
    // 预览窗口关闭
    handleCloseDialog() {
      this.pdfUrl = "";
      this.dialogVisible = false;
    },
    handleChangeGroup(value) {
      if (value != "") {
        let flag = this.groupitems.filter((k) => {
          return value === k.code;
        })[0];
        if (flag) {
          this.departitems = flag.departitems;
          this.departitem2s = flag.departitem2s;
        }
      } else {
        let flag = this.batchitems.filter((k) => {
          return this.searchForm.batch === k.code;
        })[0];
        if (flag) {
          this.departitems = flag.departitems;
          this.departitem2s = flag.departitem2s;
        }
      }
      this.handleSearchPageTable();
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
    // 文件打印预览
    handlePreview(domId) {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行预览",
          type: "error",
        });
        return false;
      }
      switch (domId) {
        case "btnGuide": // 指引单
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "指引单") {
              if (this.downloadList.length != 1) {
                this.$message.warning("请勾选一位人员后进行预览");
                return;
              }
              if (this.downloadList[0].freeze == 1) {
                this.$message.warning(
                  `${this.downloadList[0].name} 数据已冻结!`
                );
                return;
              }
              let indexP =
                d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
              let repname = "";
              let k = this.downloadList[0];
              if (
                k.meccode == 0 &&
                k.companytype.toLowerCase().indexOf("vip") > -1
              ) {
                if (k.checktype == "1") {
                  repname = `${indexP}指引单`;
                } else if (k.checktype == "2") {
                  repname = `${indexP}入职指引单`;
                } else {
                  repname = `${indexP}团体指引单`;
                }
              } else if (k.meccode == 1) {
                // 判断单位打印指引单类型 12666
                if (k.companycode == 12666) {
                  k.detailcount < 6
                    ? (repname = `${indexP}高干入职指引单A5`)
                    : (repname = `${indexP}高干入职指引单A4`);
                } else {
                  k.detailcount < 6
                    ? (repname = `${indexP}高干指引单A5`)
                    : (repname = `${indexP}高干指引单A4`);
                }
              } else if (k.meccode == 3) {
                if (psData.checktype == "2") {
                  repname = `${indexP}番禺入职指引单`;
                } else {
                  repname = `${indexP}番禺指引单`;
                }
              } else {
                if (k.personalflag == 1) {
                  repname = `${indexP}团体指引单`;
                } else {
                  repname = d.$children[0].$attrs["data-remark"];
                }
              }
              if (k.meccode == 1) {
                repname = `${indexP}${repname}`;
              }
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [k.regid],
                repname,
                printflag: 1,
                whereitems: [],
              };
              printBase64(data).then((res) => {
                this.dialogVisible = true;
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
        case "btnPaySingle": // 缴费单
          console.log(2);
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "缴费单") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: this.selectArr,
                repname: d.$children[0].$attrs["data-remark"],
                whereitems: [],
              };
              printBase64(data).then((res) => {
                this.dialogVisible = true;
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
        case "btnLabel": // 标签
          console.log(4);
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "标签") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: this.selectArr,
                repname: d.$children[0].$attrs["data-remark"],
                whereitems: [],
              };
              printBase64(data).then((res) => {
                this.dialogVisible = true;
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
        case "btnBarCode": // 条码
          console.log(5);
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "条码") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: this.selectArr,
                repname: d.$children[0].$attrs["data-remark"],
                whereitems: [],
              };
              printBase64(data).then((res) => {
                this.dialogVisible = true;
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
        case "btnReport": // 报告书
          console.log(6);
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "报告书") {
              let index = this.pageData.findIndex((k) => {
                return k.regid == this.chooseArr[0];
              });
              let indexP =
                d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
              let repname = "";
              if (
                this.pageData[index].meccode == 0 &&
                this.pageData[index].companytype.toLowerCase().indexOf("vip") >
                  -1
              ) {
                if (this.pageData[index].checktype == "1") {
                  repname = `${indexP}报告书`;
                } else if (this.pageData[index].checktype == "2") {
                  repname = `${indexP}入职报告书`;
                } else {
                  repname = `${indexP}团体报告书`;
                }
              } else if (index != -1 && this.pageData[index].meccode == 1) {
                repname = `${indexP}高干报告书`;
              } else if (this.pageData[index].meccode == 3) {
                repname = `${indexP}番禺报告书`;
              } else {
                if (this.pageData[index].personalflag == 1) {
                  repname = `${indexP}团体报告书`;
                } else {
                  if (this.pageData[index].checktype == 2) {
                    repname = `${indexP}入职报告书`;
                  } else {
                    repname = d.$children[0].$attrs["data-remark"];
                  }
                }
              }
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: this.selectArr,
                // repname: d.$children[0].$attrs["data-remark"],
                designtype: repname.includes("F") ? "fast" : "dev",
                repname,
                whereitems: [],
              };
              printBase64(data).then((res) => {
                this.dialogVisible = true;
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
        case "btnPhysique": // 体格检查表
          console.log(7);
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "体格检查表") {
              let index = this.pageData.findIndex((k) => {
                return k.regid == this.chooseArr[0];
              });
              let indexP =
                d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
              let repname = "";
              if (index != -1 && this.pageData[index].meccode == 1) {
                repname = `${indexP}高干体格检查表`;
              } else if (this.pageData[index].meccode == 3) {
                repname = `${indexP}番禺体格检查表`;
              } else {
                repname = d.$children[0].$attrs["data-remark"];
              }
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: this.selectArr,
                repname,
                whereitems: [],
              };
              printBase64(data).then((res) => {
                this.dialogVisible = true;
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
    // 文件导出回调
    handleGetExportFile() {
      let whereitems = [];
      Object.keys(this.searchForm).forEach((item) => {
        if (this.searchForm[item] && item != "batch") {
          whereitems.push({
            key: item,
            value: this.searchForm[item],
          });
        }
      });
      getExportFile({
        apicontrol: "FullSearch",
        apimethod: "Load",
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      }).then((res) => {
        // window.open(res.result);
        const link = document.createElement("a"); //创建下载a标签
        link.href = res.result;
        link.style.display = "none"; //默认隐藏元素
        document.body.appendChild(link); // body中添加元素
        link.click(); // 执行点击事件
        document.body.removeChild(link); //下载完成后移除元素
      });
    },
    // 导出为PDF
    handleGetExportPdf() {
      if (this.selectArr.length == 0) return false;
      this.downloadList.forEach((k) => {
        let repname = "";
        if (k.meccode == 1) {
          repname = `1、高干报告书`;
        } else if (k.meccode == 3) {
          repname = `1、番禺报告书`;
        } else {
          if (k.personalflag == 1) {
            repname = `1、团体报告书`;
          } else {
            if (k.checktype == 2) {
              repname = `1、入职报告书`;
            } else {
              repname = `1、报告书`;
            }
          }
        }
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [k.regid],
          repname,
          // repname: `1、报告书`,
          printflag: 1,
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
          const a = document.createElement("a");
          a.href = url;
          a.download = `${k.regid}-${k.name}`; // 下载文件的名字
          // a.download = res.data[0].printname; // 下载文件的名字
          document.body.appendChild(a);
          a.click();
        });
      });
    },
    // 体检登记清单
    handlePrintRegisList() {
      if (this.downloadList.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出体检登记清单",
          type: "error",
        });
        return false;
      }
      let regidsin = this.downloadList.map((k) => {
        return k.regid;
      });
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [],
        repname: "体检登记清单",
        printflag: 1,
        whereitems: [
          {
            key: "regidsin",
            valueList: regidsin,
          },
        ],
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
      });
    },
    // 打印指引单
    handlePrintGuide() {
      if (this.downloadList.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出指引单",
          type: "error",
        });
        return false;
      }
      this.$refs.popoverRefIdc.forEach(async (d) => {
        if (d.$children[0].$el.innerText == "指引单") {
          let tempcount = 0;
          let tempArr = [];
          for (let i = 0; i < this.downloadList.length; i++) {
            tempcount = i;
            console.log(this.downloadList[i].freeze);
            if (this.downloadList[i].freeze == 1) {
              tempArr.push(this.downloadList[i].name);
              continue;
            }
            console.log(this.downloadList[i].freeze, "执行了吗");
            let indexP =
              d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
            let repname = "";
            //     let tempArr = this.groupTableData.map((k) => {
            //   return k.combinecode;
            // });
            //     if (tempArr.includes("205032")) {
            //   repname = `${indexP}高干指引单知书版`;
            // } else
            if (
              this.downloadList[i].meccode == 0 &&
              this.downloadList[i].companytype.toLowerCase().indexOf("vip") > -1
            ) {
              if (this.downloadList[i].checktype == "1") {
                repname = `${indexP}指引单`;
              } else if (k.checktype == "2") {
                repname = `${indexP}入职指引单`;
              } else {
                repname = `${indexP}团体指引单`;
              }
            } else if (this.downloadList[i].meccode == 1) {
              // 判断单位打印指引单类型 12666
              if (this.downloadList[i].companycode == 12666) {
                this.downloadList[i].detailcount < 6
                  ? (repname = `${indexP}高干入职指引单A5`)
                  : (repname = `${indexP}高干入职指引单A4`);
              } else {
                this.downloadList[i].detailcount < 6
                  ? (repname = `${indexP}高干指引单A5`)
                  : (repname = `${indexP}高干指引单A4`);
              }
            } else if (this.downloadList[i].meccode == 3) {
              if (psData.checktype == "2") {
                repname = `${indexP}番禺入职指引单`;
              } else {
                repname = `${indexP}番禺指引单`;
              }
            } else {
              if (this.downloadList[i].personalflag == 1) {
                repname = `${indexP}团体指引单`;
              } else {
                repname = d.$children[0].$attrs["data-remark"];
              }
            }
            if (this.downloadList[i].meccode == 1) {
              repname = `${indexP}${repname}`;
            }
            let data = {
              fingercode: localStorage.getItem("md5code"),
              codes: [this.downloadList[i].regid],
              repname,
              printflag: 1,
              whereitems: [],
            };
            await printBase64(data).then((res) => {
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
          }
          if (tempcount == this.downloadList.length - 1) {
            this.$message.warning(
              `${tempArr.join("，")} 数据已冻结,已为您跳过!`
            );
          }
        }
      });
    },
    // 打印缴费单
    handlePaySingle() {
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出缴费单",
          type: "error",
        });
        return false;
      }
      this.$refs.popoverRefIdc.forEach((d) => {
        console.log(10);
        if (d.$children[0].$el.innerText == "缴费单") {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: this.selectArr,
            repname: d.$children[0].$attrs["data-remark"],
            printflag: 1,
            whereitems: [],
          };
          // console.log(data);
          // return
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
        }
      });
    },
    // 打印标签单
    handlePrintLabel() {
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出标签",
          type: "error",
        });
        return false;
      }
      this.$refs.popoverRefIdc.forEach((d) => {
        console.log(11);
        if (d.$children[0].$el.innerText == "标签") {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: this.selectArr,
            repname: d.$children[0].$attrs["data-remark"],
            printflag: 1,
            whereitems: [],
          };
          // console.log(data);
          // return
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
        }
      });
    },
    // 打印条码
    handlePrintBarCode() {
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出标签",
          type: "error",
        });
        return false;
      }
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$children[0].$el.innerText == "条码") {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: this.selectArr,
            repname: d.$children[0].$attrs["data-remark"],
            printflag: 1,
            whereitems: [],
          };
          // console.log(data);
          // return
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
        }
      });
    },
    handleSelectPeopleAll({ records }) {
      this.downloadList = JSON.parse(JSON.stringify(records));
      let arr = records.map((k) => {
        return k.regid;
      });
      this.chooseArr = arr;
      this.selectArr = arr;
    },
    // 人员列表选中数据回调
    handleSelectPeople({ records }) {
      let arr = records.map((k) => {
        return k.regid;
      });
      this.downloadList = JSON.parse(JSON.stringify(records));
      this.chooseArr = arr;
      this.selectArr = arr;
    },
    // 主页列表数据搜索
    handleSearchPageTable() {
      this.handleGetPageList();
    },
    // 列表表格数据查询回调
    handleGetPageList() {
      this.loading = true;
      let whereitems = [];
      Object.keys(this.searchForm).forEach((item) => {
        if (this.searchForm[item] && item != "batch") {
          whereitems.push({
            key: item,
            value: this.searchForm[item],
          });
        }
      });
      // if (this.conditionDate && this.conditionDate.length > 0) {
      //   whereitems.push({
      //     key: "startdate",
      //     value: this.conditionDate[0],
      //   });
      //   whereitems.push({
      //     key: "enddate",
      //     value: this.conditionDate[1],
      //   });
      // }
      CustomerResultExportLoad({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          // console.log(res.data[0].meccode,'111');
          // meccode(院区标识）判断为1，报告书报表调用‘高干报告书’模版
          if (res.data) {
            this.meccodes = res.data[0].meccode;
            this.count = res.count;
            this.pageData = res.data;
            if (
              this.isEnterRegid &&
              this.autoPrintReport &&
              this.pageData.length == 1
            ) {
              this.handlePrintReportAuto(this.pageData[0]);
            }
            if (
              this.isEnterRegid &&
              this.autoPhysique &&
              this.pageData.length == 1
            ) {
              this.handlePhysiqueAuto(this.pageData[0]);
            }
          } else {
            this.count = 0;
            this.pageData = [];
          }
          this.loading = false;
          // if (this.isEnterRegid) {
          //   this.pageData.push(...res.data);
          // } else {
          //   this.pageData = res.data;
          // }
        })
        .catch(() => {
          this.loading = false;
        });
      this.searchForm.regid = "";
    },
    // 单位下拉列表改变值触发回调
    handleChangeCompany() {
      this.handleGetBatch();
    },
    // 加载搜索条件返回合集回调
    handleGetLoadSearchInfo() {
      getLoadSearchInfo().then((res) => {
        let { meccodeitems, companyitems, statusitems, reporttypeitems } =
          res.result;
        this.meccodeitems = meccodeitems; // 体检中心集合
        this.companyitems = companyitems; // 公司集合
        this.statusitems = statusitems; // 状态集合
        this.reporttypeitems = reporttypeitems; // 报告类型集合
        // 数据回填
        let meccode = meccodeitems.filter((k) => k.selected)[0];
        meccode && (this.searchForm.meccode = meccode.code);
        let company = companyitems.filter((k) => k.selected)[0];
        company && (this.searchForm.company = company.code);
        let status = statusitems.filter((k) => k.selected)[0];
        status && (this.searchForm.status = status.code);
        let reporttype = reporttypeitems.filter((k) => k.selected)[0];
        reporttype && (this.searchForm.reporttype = reporttype.code);
      });
    },
    // 选择单位请求批次号回调
    handleGetBatch() {
      getBatch({ companycode: this.searchForm.companycode }).then((res) => {
        console.log(res.result);
        this.searchForm.batch = ""; // 重置批次号
        let { batchitems } = res.result;
        this.batchitems = batchitems;
        let selectIndex = batchitems.findIndex((k) => k.selected);
        console.log(selectIndex);
        if (selectIndex > -1) {
          this.searchForm.batch = batchitems[selectIndex].code;
          this.groupitems = batchitems[selectIndex].groupitems;
          this.departitems = batchitems[selectIndex].departitems;
          this.departitem2s = batchitems[selectIndex].departitem2s;
          let group = batchitems[selectIndex].groupitems.filter(
            (k) => k.selected
          )[0];
          group && (this.searchForm.groupcode = group.code);
        }
      });
    },
    // 按钮点击页面跳转回调
    handleJumpPage(data, item) {
      if (!item) return false;
      if (item.code == "CustomerRegister") {
        jumpRouteLink(this, "personalregister");
        this.$router.push({
          path: `/personalregister/${this.Hospitals}`,
          query: { regid: data.regid },
        });
      } else if (item.code == "DepartCheck") {
        jumpRouteLink(this, "customerResult");
        this.$router.push({
          path: `/customerResult/${this.Hospitals}`,
          query: { regid: data.regid },
        });
      } else if (item.code == "TotalCheck") {
        jumpRouteLink(this, "totalcheck");
        this.$router.push({
          path: `/totalcheck/${this.Hospitals}`,
          query: { regid: data.regid },
        });
      }
    },
    // 收入检索身份证/条件号等回调
    handleInputWork() {},
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
    // 点击选择检索体检条件回调
    handleSelectCondition(val) {
      this.condition = val.name;
      this.conditionCode = val.key;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    // 自动打印报告书
    handlePrintReportAuto(item) {
      if (item.status < 7) {
        this.$confirm("该用户暂未审核不允许打印!", "提示", {
          confirmButtonText: "是",
          distinguishCancelAndClose: true,
          showClose: false,
          showCancelButton: false,
          closeOnClickModal: false,
          type: "warning",
        })
          .then((status) => {})
          .catch((status) => {});
        return;
        this.$confirm("该用户还未总检, 是否继续打印?", "提示", {
          confirmButtonText: "打印",
          cancelButtonText: "不打印",
          distinguishCancelAndClose: true,
          showClose: false,
          closeOnClickModal: false,
          type: "warning",
        })
          .then((status) => {
            if (status == "confirm") {
              this.handlePrintReport();
            }
          })
          .catch((status) => {
            if (status == "cancel") {
              this.$message({
                type: "info",
                message: "已取消打印",
              });
            }
          });
      } else if (item.reportprintflag == 1) {
        this.$confirm("该用户已经打印, 是否继续打印?", "提示", {
          confirmButtonText: "打印",
          cancelButtonText: "不打印",
          distinguishCancelAndClose: true,
          showClose: false,
          closeOnClickModal: false,
          type: "warning",
        })
          .then((status) => {
            if (status == "confirm") {
              let index = this.pageData.findIndex((k) => {
                return k.regid == item.regid;
              });
              let repname = "";
              if (index != -1 && this.pageData[index].meccode == 1) {
                repname = `1、高干报告书`;
              } else if (this.pageData[index].meccode == 3) {
                repname = `1、番禺报告书`;
              } else {
                if (this.pageData[index].personalflag == 1) {
                  repname = `1、团体报告书`;
                } else {
                  if (this.pageData[index].checktype == 2) {
                    repname = `1、入职报告书`;
                  } else {
                    repname = `1、报告书`;
                  }
                }
              }
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [item.regid],
                // repname: d.$children[0].$attrs["data-remark"],
                repname,
                designtype: repname.includes("F") ? "fast" : "dev",
                printflag: 1,
                whereitems: [],
              };
              printBase64(data).then((res) => {
                this.pageData.forEach((k, index) => {
                  if (item.regid === k.regid) {
                    k.reportprintflag = 1;
                    k.reportprintdate = new Date(+new Date() + 8 * 3600 * 1000)
                      .toJSON()
                      .substr(0, 19)
                      .replace("T", " ");
                  }
                });
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
                // this.lodop.SET_PRINT_MODE("PRINT_START_PAGE", 2); // 设置从第2页开始打印;
                // this.lodop.SET_PRINT_MODE("PRINT_END_PAGE", 3); // 设置从第3页结束打印;
                this.isEnterRegid = false;
                printObj.printBase64PdfReport(this.lodop, fileList);
              });
            }
          })
          .catch((status) => {
            if (status == "cancel") {
              this.$message({
                type: "info",
                message: "已取消打印",
              });
            }
          });
      } else {
        let index = this.pageData.findIndex((k) => {
          return k.regid == item.regid;
        });
        let repname = "";
        if (index != -1 && this.pageData[index].meccode == 1) {
          repname = `1、高干报告书`;
        } else if (this.pageData[index].meccode == 3) {
          repname = `1、番禺报告书`;
        } else {
          if (this.pageData[index].personalflag == 1) {
            repname = `1、团体报告书`;
          } else {
            if (this.pageData[index].checktype == 2) {
              repname = `1、入职报告书`;
            } else {
              repname = `1、报告书`;
            }
          }
        }
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [item.regid],
          // repname: d.$children[0].$attrs["data-remark"],
          repname,
          designtype: repname.includes("F") ? "fast" : "dev",
          printflag: 1,
          whereitems: [],
        };
        printBase64(data).then((res) => {
          this.pageData.forEach((k, index) => {
            if (item.regid === k.regid) {
              k.reportprintflag = 1;
              k.reportprintdate = new Date(+new Date() + 8 * 3600 * 1000)
                .toJSON()
                .substr(0, 19)
                .replace("T", " ");
            }
          });
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
          // this.lodop.SET_PRINT_MODE("PRINT_START_PAGE", 2); // 设置从第2页开始打印;
          // this.lodop.SET_PRINT_MODE("PRINT_END_PAGE", 3); // 设置从第3页结束打印;
          this.isEnterRegid = false;
          printObj.printBase64PdfReport(this.lodop, fileList);
        });
      }
    },
    handlePrintReportOccupation() {
      if (this.selectArr.length == 0) {
        this.$message.warning("请先勾选打印人员!");
        return false;
      }
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: this.selectArr,
        designtype: "dev",
        repname: "1、职业报告书",
        printflag: 1,
        whereitems: [],
      };
      printBase64(data).then((res) => {
        this.selectArr.forEach((item) => {
          this.pageData.forEach((k, index) => {
            if (item === k.regid) {
              console.log(k.name);
              k.reportprintflag = 1;
              k.reportprintdate = new Date(+new Date() + 8 * 3600 * 1000)
                .toJSON()
                .substr(0, 19)
                .replace("T", " ");
            }
          });
        });
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
    handlePrintReport() {
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$children[0].$el.innerText == "报告书") {
          let index = this.pageData.findIndex((k) => {
            return k.regid == this.chooseArr[0];
          });
          let indexP =
            d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
          let repname = "";
          if (
            this.pageData[index].meccode == 0 &&
            this.pageData[index].companytype.toLowerCase().indexOf("vip") > -1
          ) {
            if (this.pageData[index].checktype == "1") {
              repname = `${indexP}报告书`;
            } else if (this.pageData[index].checktype == "2") {
              repname = `${indexP}入职报告书`;
            } else {
              repname = `${indexP}团体报告书`;
            }
          } else if (index != -1 && this.pageData[index].meccode == 1) {
            repname = `${indexP}高干报告书`;
          } else if (this.pageData[index].meccode == 3) {
            repname = `${indexP}番禺报告书`;
          } else {
            if (this.pageData[index].personalflag == 1) {
              repname = `${indexP}团体报告书`;
            } else {
              if (this.pageData[index].checktype == 2) {
                repname = `${indexP}入职报告书`;
              } else {
                repname = d.$children[0].$attrs["data-remark"];
              }
            }
          }
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: this.selectArr,
            // repname: d.$children[0].$attrs["data-remark"],
            repname,
            designtype: repname.includes("F") ? "fast" : "dev",
            printflag: 1,
            whereitems: [],
          };
          printBase64(data).then((res) => {
            this.selectArr.forEach((item) => {
              this.pageData.forEach((k, index) => {
                if (item === k.regid) {
                  console.log(k.name);
                  k.reportprintflag = 1;
                  k.reportprintdate = new Date(+new Date() + 8 * 3600 * 1000)
                    .toJSON()
                    .substr(0, 19)
                    .replace("T", " ");
                }
              });
            });
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
            // this.lodop.SET_PRINT_MODE("PRINT_START_PAGE", 2); // 设置从第2页开始打印;
            // this.lodop.SET_PRINT_MODE("PRINT_END_PAGE", 3); // 设置从第3页结束打印;
            printObj.printBase64PdfReport(this.lodop, fileList);
          });
        }
      });
    },
    handlePhysiqueAuto(item) {
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$children[0].$el.innerText == "体格检查表") {
          let index = this.pageData.findIndex((k) => {
            return k.regid == item.regid;
          });
          let indexP =
            d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
          let repname = "";
          if (index != -1 && this.pageData[index].meccode == 1) {
            repname = `${indexP}高干体格检查表`;
          } else if (this.pageData[index].meccode == 3) {
            repname = `${indexP}番禺体格检查表`;
          } else {
            repname = d.$children[0].$attrs["data-remark"];
          }
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [item.regid],
            repname,
            printflag: 1,
            whereitems: [],
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
        }
      });
    },

    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "btnSearch": // 查询主页列表数据
          this.handleSearchPageTable();
          break;
        case "btnExport": // 导出表格
          this.handleExportExcel();
          break;
        case "btnExportControl": // 导出控制
          this.handleExportControl();
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
@import "./css/index.scss";
</style>