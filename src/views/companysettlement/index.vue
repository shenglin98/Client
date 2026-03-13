<template>
  <div class="company_settlement">
    <!-- 主页 -->
    <div v-if="!showPage" class="page">
      <!-- 头部操作控件 -->
      <!-- <sticky :className="'sub-navbar'">
        <div class="filter-container">
          <permission-btn
            moduleName="customerResult"
            ref="companysettlement"
            size="mini"
            v-on:btn-event="hadnleOnBtnClicked"
          >
          </permission-btn>
        </div>
      </sticky> -->
      <div class="filter-container">
        <div v-for="(btn, index) of buttons" :key="index">
          <el-popover
            ref="popoverRefIdc"
            v-if="domIdArr.includes(btn.domId)"
            class="print_box"
            placement="bottom"
            trigger="click"
          >
            <el-button
              type="primary"
              plain
              slot="reference"
              :size="size"
              v-bind:key="btn.Id"
              v-bind:data-remark="btn.remark"
              class="filter-item"
              ><i :class="`iconfont icon-${btn.icon}`"></i
              >{{ btn.name }}</el-button
            >
            <div class="print_item" @click="hadnleOnBtnClicked(btn.domId)">
              打印
            </div>
            <div class="print_item" @click="handlePreview(btn.domId)">预览</div>
          </el-popover>
          <el-button
            type="primary"
            plain
            v-else
            :size="size"
            v-bind:key="btn.Id"
            v-bind:data-remark="btn.remark"
            class="filter-item"
            @click="hadnleOnBtnClicked(btn.domId)"
            ><i :class="`iconfont icon-${btn.icon}`"></i
            >{{ btn.name }}</el-button
          >
        </div>
      </div>
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
            <el-form
              :inline="true"
              :model="formInline"
              class="demo-form-inline"
              height="30"
              style="height: 40px"
            >
              <el-form-item label="结算日期">
                <el-date-picker
                  @change="handleChangeDate"
                  size="mini"
                  v-model="conditionDate"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="单位名称">
                <el-select
                  style="width: 300px"
                  size="mini"
                  v-model="company"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="handleRemoteMethod"
                  :loading="selectLoading"
                  @clear="handleRemoteMethod"
                  @change="handleSelectCompany"
                >
                  <el-option
                    v-for="item in companyitems"
                    :key="item.code"
                    :label="`${item.code}　${item.name}`"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
                <!-- <el-select @change="handleSelectCompany" clearable v-model="company" style="width: 300px" size="mini">
                  <el-option v-for="(item, index) in companyitems" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
                </el-select> -->
              </el-form-item>
              <el-form-item label="批次">
                <el-select v-model="batch" size="mini">
                  <el-option
                    v-for="(item, index) in batchitems"
                    clearable
                    :key="index"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <!-- 内容 -->
        <el-card class="box-card content_box">
          <!-- 内容标题 -->
          <div class="head_title">
            <div class="head_logo"></div>
            <p>结算列表</p>
          </div>
          <!-- 内容表单 -->
          <div class="content_team_form">
            <EasyTable
              height="100%"
              :data="tableData"
              class="page_table"
              :tableOptions="tableOptions"
              :radio-config="{ fetch: true, rowClick: true }"
              :border="false"
              :header-cell-style="handleReturnStyle"
              :row-class-name="handleTableRowClassName"
              :row-style="{ height: '32px' }"
              :cell-style="{ padding: '0' }"
              @row-click="handleChooseCompany"
            />
          </div>
        </el-card>
      </div>
      <!-- 预览弹框 -->
      <el-dialog
        title="预览"
        class="preview_box"
        :visible.sync="dialogVisible"
        width="700px"
        @close="handleCloseDialog"
      >
        <iframe
          ref="pdfCotainer"
          :src="pdfUrl"
          width="100%"
          style="height: calc(100vh - 147px)"
        ></iframe>
      </el-dialog>
    </div>

    <!-- 新增或编辑 -->
    <AddOrEdit
      v-else
      :addOrEdit="pageFlag"
      @close="handleCloseAddOrEdit"
      :pSetid="pSetid"
    />
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import AddOrEdit from "./components/addOrEdit.vue";
import * as company_archives from "@/api/company_archives";
import {
  getPageList,
  getCompanyList,
  getBatchList,
} from "@/api/companysettlement.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import { printStaticsBase64 } from "@/api/printreport.js";
import { mapGetters } from "vuex";

export default {
  name: "companysettlement",

  components: {
    Sticky,
    permissionBtn,
    AddOrEdit,
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
    };
  },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),

    //   主页主体表格配置
    tableOptions() {
      return [
        {
          type: "radio",
          width: 45,
        },
        {
          title: "单位编码",
          prop: "companycode",
          width: 110,
          omit: 1,
        },
        {
          title: "单位名称",
          width: 250,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => this.handleShowEdit(data)}
              >
                {data.companyname}
              </el-link>
            );
          },
        },
        {
          title: "批次",
          prop: "batch",
          width: 110,
          omit: 1,
        },
        {
          title: "结算时间",
          prop: "operatdate",
          width: 180,
          omit: 1,
        },
        {
          title: "实收金额",
          prop: "setdiscounttotal",
          // prop: "setactualtotal",
          width: 110,
          omit: 1,
        },
        {
          title: "体检人数",
          prop: "personnelTotal",
          width: 110,
          omit: 1,
        },
        {
          title: "结算流水号",
          prop: "setid",
          width: 110,
          omit: 1,
        },
        {
          title: "结算人",
          prop: "operatorname",
          width: 110,
          omit: 1,
        },
        {
          title: "状态",
          prop: "chargeflag",
          returnVal: (value) => {
            return value == 0 ? "申请结算" : value == 1 ? "已结算" : "";
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
    //   页面加载请求数据
    this.handleGetCompanyList();
    // this.handleGetconditionDate();
    this.handleGetPrintDate();
  },
  methods: {
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
      this.chooseCompany = row;
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
      // if (!this.company || !this.batch) return;
      let whereitems = [];
      if (this.company) {
        whereitems.push({
          key: "companycode",
          value: this.company,
        });
      }
      if (this.batch) {
        whereitems.push({
          key: "batch",
          value: this.batch,
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
      getPageList({
        page: 1,
        limit: 100000,
        whereitems,
      }).then((res) => {
        this.tableData = res.data;
      });
    },
    // 公司选中获取数据回调
    handleSelectCompany(data) {
      if (!data) {
        this.batch = "";
        this.tableData = [];
        return false;
      } else {
        getBatchList({ companycode: this.company }).then((res) => {
          this.batchitems = res.result.batchitems;
          let batch = this.batchitems.filter((k) => k.selected)[0];
          batch && (this.batch = batch.code);
          this.handleGetPageList();
        });
      }
    },
    // 获取公司列表信息回调
    handleGetCompanyList() {
      getCompanyList().then((res) => {
        this.companyitems = res.result.companyitems;
        let company = this.companyitems.filter((k) => k.selected)[0];
        company && (this.company = company.code);
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