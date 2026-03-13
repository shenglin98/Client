<template>
  <div class="shortlettermanage">
    <!-- 主页 -->
    <div class="page" v-if="!showImportSend">
      <!-- 头部操作控件 -->
      <sticky :className="'sub-navbar'">
        <div class="filter-container">
          <permission-btn moduleName="customerResult" ref="companysettlement" size="mini" v-on:btn-event="hadnleOnBtnClicked">
          </permission-btn>
        </div>
      </sticky>
      <div class="pagebox">
        <el-card class="box-card head_box">
          <!-- 头部标题 -->
          <div class="head_title">
            <div class="head_logo"></div>
            <!-- <div class="head-logo"></div> -->
            <p>检索条件</p>
          </div>
          <!-- 头部表单 -->
          <div class="head_content">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" height="30" style="height: 40px">
              <el-form-item label="发送时间">
                <el-date-picker @change="handleChangeDate" size="mini" v-model="conditionDate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
              </el-form-item>
              <el-form-item label="短信来源">
                <el-select size="mini" v-model="SourceCategory" clearable filterable>
                  <el-option v-for="item in SourceCategoryitems" :key="item.code" :label="`${item.code}　${item.name}`" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="来源编码">
                <el-input size="mini" v-model="SourceCode" clearable></el-input>
              </el-form-item>
              <el-form-item label="接收手机">
                <el-input size="mini" v-model="ReceiverMobile" clearable></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <!-- 内容 -->
        <el-card class="box-card content_box">
          <!-- 内容标题 -->
          <div class="head_title">
            <div class="head_logo"></div>
            <p>列表数据</p>
          </div>
          <!-- 内容表单 -->
          <div class="content_team_form">
            <div class="table_1">
              <EasyTable height="100%" :data="tableData" class="page_table" :tableOptions="tableOptions" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" @row-click="handleChooseCompany" />
              <div class="totle_box">共 {{ tableData.length }} 条</div>
            </div>
            <div class="table_2">
              <EasyTable height="100%" :data="tableDataSON" class="page_table" :tableOptions="tableOptionsSON" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
            </div>
          </div>
        </el-card>
      </div>
      <!-- 预览弹框 -->
      <el-dialog title="预览" class="preview_box" :visible.sync="dialogVisible" width="700px" @close="handleCloseDialog">
        <iframe ref="pdfCotainer" :src="pdfUrl" width="100%" style="height: calc(100vh - 147px)"></iframe>
      </el-dialog>
    </div>
    <!-- 导入发送 -->
    <IportSend v-else @close="showImportSend = false" />
  </div>
</template>
  <script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import * as company_archives from "@/api/company_archives";
import {
  SysStationletterSmsLoad,
  SysStationletterSmsDetailLoad,
} from "@/api/shortlettermanage.js";
import { getPublicConfig } from "@/api/dataanalysis.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import { printStaticsBase64 } from "@/api/printreport.js";
import { mapGetters } from "vuex";
import IportSend from "./components/importSend.vue";

export default {
  name: "shortlettermanage",

  components: {
    Sticky,
    permissionBtn,
    IportSend,
  },
  props: {
    size: {
      type: String,
      default: "mini",
    },
  },
  data() {
    return {
      formInline: {
        medical_center: "",
        team_name: "",
        batch: "",
        team_grou: "",
        state: "",
      },
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
      // 表单数据
      dateRange: "30", // ,默认日期范围
      tableData: [],
      conditionDate: "",
      showPage: false, // 页面控制显示
      pageFlag: "", // 当前页面操作状态 add  edit
      companyitems: [], // 公司列表数据
      company: "", // 选中公司单位
      dialogVisible: false,
      batchitems: [], // 批次列表数据
      batch: "", // 选中批次号
      pSetid: "", // 编辑id
      chooseCompany: undefined, // 当前选中单位信息
      selectLoading: false,
      printDate: "",
      buttons: [],
      domIdArr: ["btnPrint"],
      pdfUrl: "",
      SourceCategoryitems: [],
      SourceCategory: "",
      SourceCode: "",
      ReceiverMobile: "",
      tableDataSON: [],
      chooseSms: null,
      showImportSend: false,
    };
  },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),

    //   主页主体表格配置
    tableOptions() {
      return [
        {
          title: "短信来源",
          prop: "sourceCategory",
          width: 150,
          omit: 1,
        },
        {
          title: "来源编码",
          prop: "sourceCode",
          width: 150,
          omit: 1,
        },
        {
          title: "发送人",
          prop: "createPerson",
          width: 150,
          omit: 1,
        },
        {
          title: "签名模板",
          prop: "signName",
          omit: 1,
        },
        {
          title: "发送时间",
          prop: "createTime",
          width: 180,
          omit: 1,
        },
      ];
    },
    //   主页主体表格配置
    tableOptionsSON() {
      return [
        // {
        //   title: "记录id",
        //   prop: "smsSendLogID",
        //   width: 120,
        //   omit: 1,
        // },
        {
          title: "接收电话",
          prop: "receiverMobile",
          width: 120,
          omit: 1,
        },
        {
          title: "短信内容",
          prop: "smsBody",
          omit: 1,
        },
        {
          title: "发送状态",
          prop: "runStatus",
          width: 120,
          omit: 1,
          returnVal: (val, row) => {
            return val == 1 ? "成功" : "失败";
          },
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
    this.handleGetPublicConfig();
    this.handleGetPrintDate();
  },
  methods: {
    handleShowImportSend() {
      this.showImportSend = true;
    },
    handleSysStationletterSmsDetailLoad() {
      console.log(this.chooseSms);
      SysStationletterSmsDetailLoad({
        page: 1,
        limit: 100000,
        whereitems: [
          {
            key: "SmsCode",
            value: this.chooseSms.smsCode,
          },
        ],
      }).then((res) => {
        if (!res.data) return;
        this.tableDataSON = res.data;
      });
    },
    // 公共配置编码
    handleGetPublicConfig() {
      getPublicConfig({ cc: "SmsType" }).then((res) => {
        this.SourceCategoryitems = res.result;
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
    // 预览窗口关闭
    handleCloseDialog() {
      this.pdfUrl = "";
      this.dialogVisible = false;
    },
    handleRemoteMethod(val) {
      console.log(val);
      this.selectLoading = true;
      setTimeout(() => {
        this.selectLoading = false;
        company_archives
          .getList({
            page: 1,
            limit: 100000,
            key: val,
          })
          .then((res) => {
            this.companyitems = res.data.map((k) => {
              return {
                ...k,
                code: k.companycode,
                name: k.companyname,
              };
            });
          });
      }, 200);
    },
    handleGetPrintDate() {
      getSysConfigInfo({ cc: "Sys_Company_archives_DateRange" }).then((res) => {
        // 获取条件计算日期范围回调
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
        this.printDate = [this.gettime(start), this.gettime(end)];
        start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
        this.conditionDate = [this.gettime(start), this.gettime(end)];
      });
    },
    // 获取条件计算日期范围回调
    handleGetconditionDate() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * +this.dateRange);
      this.conditionDate = [this.gettime(start), this.gettime(end)];
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
    handleChooseCompany(row) {
      this.chooseSms = row;
      this.chooseSms && this.handleSysStationletterSmsDetailLoad();
    },
    // 点击检索条件筛选全部回调
    handleChangeDate(val) {
      this.handleGetPageList();
    },
    // 新增编辑组件关闭
    handleCloseAddOrEdit(value) {
      this.showPage = false;
      this.pSetid = "";
      this.handleGetPageList();
    },
    // 当前新增组件
    handleShowAdd() {
      this.pageFlag = "add";
      this.showPage = true;
    },
    // 当前编辑组件
    handleShowEdit(data) {
      this.pSetid = data.setid;
      this.pageFlag = "edit";
      this.showPage = true;
    },
    // 获取主页列表数据
    handleGetPageList() {
      let whereitems = [];
      if (this.SourceCategory) {
        whereitems.push({
          key: "SourceCategory",
          value: this.SourceCategory,
        });
      }
      if (this.SourceCode) {
        whereitems.push({
          key: "SourceCode",
          value: this.SourceCode,
        });
      }
      if (this.ReceiverMobile) {
        whereitems.push({
          key: "ReceiverMobile",
          value: this.ReceiverMobile,
        });
      }
      if (this.conditionDate && this.conditionDate.length > 0) {
        whereitems.push({
          key: "startdate",
          value: this.conditionDate[0],
        });
        whereitems.push({
          key: "enddate",
          value: this.conditionDate[1],
        });
      }
      SysStationletterSmsLoad({
        page: 1,
        limit: 100000,
        whereitems,
      }).then((res) => {
        this.tableData = res.data;
      });
    },
    // 列表下载
    downloadExcel() {
      if (!this.chooseCompany) {
        this.$message.warning("请选择需要导出的信息!");
        return false;
      }

      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.excelData = [this.chooseCompany]; // selectArr是一个数组，存储表格中选择的行的数据。
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
          "单位编码",
          "单位名称",
          "批次",
          "结算时间",
          "实收金额",
          "体检人数",
          "结算流水号结算人",
          "状态",
        ]; // 导出的表头名信息
        const filterVal = [
          "companycode",
          "companyname",
          "batch",
          "operatdate",
          "setactualtotal",
          "personnelTotal",
          "setid",
          "chargeflag",
        ]; // 导出的表头字段名，需要导出表格字段名
        const list = this.excelData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "导出数据"); // 导出的表格名称，根据需要自己命名
      });
    },
    // 格式转换，直接复制即可
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    }, // 打印回调
    handlePrintStaticsBase64() {
      if (!this.chooseCompany) {
        this.$message.warning("请选择统计数据!");
        return false;
      }
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$children[0].$el.innerText == "打印") {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [],
            repname: d.$children[0].$attrs["data-remark"],
            printflag: 1,
            whereitems: [
              {
                key: "companycode",
                value: this.chooseCompany.companycode,
              },
              {
                key: "batch",
                value: this.chooseCompany.batch,
              },
              {
                key: "startTime",
                value: this.printDate[0],
              },
              {
                key: "endTime",
                value: this.printDate[1],
              },
            ],
          };
          printStaticsBase64(data).then((res) => {
            this.lodop = getLodop();
            console.log(this.lodop, "this.lodop");
            let printname = ``;
            if (res.data[0].printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = res.data[0].printname;
            }
            let printObj = new LodopPrinter(null, printname);
            console.log(printObj, "printObj");
            let fileList = res.data.map((k) => {
              return k.base64String;
            });
            printObj.printBase64PdfReport(this.lodop, fileList);
          });
        }
      });
    },
    // 文件打印预览
    handlePreview(domId) {
      if (!this.chooseCompany) {
        this.$message.warning("请选择统计数据!");
        return false;
      }
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$children[0].$el.innerText == "打印") {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [],
            repname: d.$children[0].$attrs["data-remark"],
            printflag: 1,
            whereitems: [
              {
                key: "companycode",
                value: this.chooseCompany.companycode,
              },
              {
                key: "batch",
                value: this.chooseCompany.batch,
              },
              {
                key: "startTime",
                value: this.printDate[0],
              },
              {
                key: "endTime",
                value: this.printDate[1],
              },
            ],
          };
          printStaticsBase64(data).then((res) => {
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
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnSearch": // 查询
          this.handleGetPageList();
          break;
        case "btnSmsSend": // 跳转短信发送
          this.$router.push({ path: "/shortlettersend/index" });
          break;
        case "btnAddSettlement": // 新增结算
          this.handleShowAdd();
          break;
        case "btnReset": // 重置
          this.$reload();
          break;
        case "btnPrint": // 打印
          this.handlePrintStaticsBase64();
          this.$refs.popoverRefIdc.forEach((k) => {
            k.doClose(); // 关闭弹出层popover
          });
          break;
        case "btnDerive": // 导出
          this.downloadExcel();
          break;
        case "btnImportSend": // 导入发送
          this.handleShowImportSend();
          break;
        case "btnclosure": // 关闭当前页面
          this.handleClosePage();
          break;
        // case "btnKeep": // 保存
        //   this.handleSubmitPage();
        //   break;
        // case "btnToExamine": // 审核页面项目
        //   this.handleGetCheckPage();
        //   break;
        // case "btnGiveUp": // 弃检
        //   this.handleGetGiveUpCheck();
        //   break;
        // case "btnDel": // 弃检
        //   this.handleDelDepart();
        //   break;
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
@import "./css/index.scss";
</style>