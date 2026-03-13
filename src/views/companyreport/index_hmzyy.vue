<template>
  <div class="company_report">
    <!-- 头部操作控件 -->
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn
          moduleName="personalregister"
          ref="personalregister"
          size="mini"
          v-on:btn-event="hadnleOnBtnClicked"
        ></permission-btn>
      </div>
    </sticky>
    <div class="subject">
      <div class="bg">
        <!-- 检索条件 -->
        <div class="search_box">
          <div class="head">检索条件</div>
          <el-row class="search_form">
            <el-form ref="form" :model="searchForm" label-width="80px">
              <el-col :span="4">
                <el-form-item size="mini" label="体检中心">
                  <el-select
                    v-model="searchForm.meccode"
                    clearable
                    @change="handleSearchPageTable"
                  >
                    <el-option
                      v-for="(item, index) in meccodeitems"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item size="mini" label="团检名称">
                  <el-select
                    v-model="searchForm.companycode"
                    clearable
                    filterable
                    @change="handleChangeCompany"
                  >
                    <el-option
                      v-for="(item, index) in companyitems"
                      :key="index"
                      :label="`${item.code}　${item.name}`"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item size="mini" label="批次">
                  <el-select
                    v-model="searchForm.batch"
                    clearable
                    @change="handleSearchPageTable"
                  >
                    <el-option
                      v-for="(item, index) in batchitems"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item size="mini" label="团检分组">
                  <el-select
                    v-model="searchForm.groupcode"
                    clearable
                    filterable
                    @change="handleChangeGroup"
                  >
                    <el-option
                      v-for="(item, index) in groupitems"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="data_box_big" :span="8">
                <el-popover
                  ref="popoverRef"
                  placement="bottom-start"
                  trigger="click"
                  style="width: 12%; margin: 0 5px"
                >
                  <div class="content">
                    <div
                      class="content_item"
                      v-for="item in checkupDateArr"
                      :key="item.code"
                      @click="handleSelectConditionDate(item)"
                    >
                      {{ item.name }}
                    </div>
                  </div>
                  <el-button
                    type="primary"
                    plain
                    style="width: 80px"
                    size="mini"
                    slot="reference"
                    >{{ dateName }}</el-button
                  >
                </el-popover>
                <div class="date_box" style="width: 88%">
                  <el-date-picker
                    v-model="startTime"
                    size="mini"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                  <span>-</span>
                  <el-date-picker
                    v-model="endTime"
                    size="mini"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </div>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <!-- 主体 -->
        <div class="table_list">
          <div class="head">团检预约</div>
          <EasyTable
            height="100%"
            class="table"
            :data="tableData"
            :tableOptions="tableOptions"
            :radio-config="{ rowClick: true }"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :cell-style="{ padding: '0' }"
          />
        </div>
      </div>
    </div>
    <!-- 预览弹出层 -->
    <el-dialog
      title="提示"
      class="report"
      :visible.sync="dialogVisible"
      top="20px"
      :close-on-click-modal="false"
      :show-close="false"
      width="65%"
    >
      <div class="btn_group">
        <el-button type="primary" size="mini" plain @click="handlePrintReport"
          >打印</el-button
        >
        <el-button type="primary" size="mini" plain @click="handleGetExportPdf"
          >导出</el-button
        >
        <el-button type="primary" size="mini" plain @click="handleCloseDialog"
          >关闭</el-button
        >
      </div>
      <div class="content">
        <!-- <el-menu default-active="2" class="el-menu" background-color="#e6f1fa">
          <el-menu-item index="1">
            <span slot="title">封面</span>
          </el-menu-item>
          <el-menu-item index="2">
            <span slot="title">基本信息</span>
          </el-menu-item>
          <el-menu-item index="3">
            <span slot="title">人员分组</span>
          </el-menu-item>
          <el-menu-item index="4">
            <span slot="title">体检组合</span>
          </el-menu-item>
          <el-menu-item index="5">
            <span slot="title">人员分布</span>
          </el-menu-item>
          <el-menu-item index="6">
            <span slot="title">异常情况</span>
          </el-menu-item>
          <el-menu-item index="7">
            <span slot="title">健康建议</span>
          </el-menu-item>
          <el-menu-item index="8">
            <span slot="title">健康知识</span>
          </el-menu-item>
        </el-menu> -->
        <iframe
          ref="pdfCotainer"
          :src="pdfUrl"
          width="100%"
          style="height: calc(100vh - 147px)"
        ></iframe>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import { CompanyReportLoad } from "@/api/CompanyRegister";
import { getLoadSearchInfo, getBatch } from "@/api/fullsearch.js";
import { printStaticsBase64 } from "@/api/printreport.js";
export default {
  name: "companyreport",

  components: { Sticky, permissionBtn },

  data() {
    return {
      searchForm: {
        meccode: "",
        companycode: "",
        batch: "",
        groupcode: "",
      },
      tableData: [],
      dialogVisible: false,
      pdfUrl: "",
      meccodeitems: [], // 体检中心集合
      companyitems: [], // 公司集合
      batchitems: [], // 批次集合
      groupitems: [], // 组合集合
      base64String: "",
      base64StringArr: [],
      chooseCompany: null,
      checkupDateArr: [
        { code: "regdate", name: "登记日期" },
        { code: "inputdate", name: "结果时间" },
        { code: "checkdate", name: "审核时间" },
        { code: "checkdatetj", name: "体检日期" },
      ],
      dateCode: "regdate",
      dateName: "登记日期",
      startTime: "",
      endTime: "",
    };
  },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),

    tableOptions() {
      return [
        {
          title: "团体名称",
          prop: "companyname",
          width: 220,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => {
                  this.handleSeeReport(data);
                }}
              >
                {data.companyname}
              </el-link>
            );
          },
        },
        {
          title: "批次",
          prop: "batch",
          omit: 1,
        },
        {
          title: "预约时间",
          prop: "registerdate",
          width: 120,
          omit: 1,
        },
        {
          title: "体检人数",
          prop: "total",
          width: 100,
          omit: 1,
        },
        {
          title: "开始时间",
          prop: "startdate",
          width: 120,
          omit: 1,
        },
        {
          title: "结束时间",
          prop: "enddate",
          width: 120,
          omit: 1,
        },
        {
          title: "接待人",
          prop: "receptionname",
          omit: 1,
        },
        {
          title: "联系人",
          prop: "contacts",
          omit: 1,
        },
        {
          title: "联系电话",
          prop: "telephone",
          width: 150,
          omit: 1,
        },
        {
          title: "邮箱",
          prop: "email",
          omit: 1,
        },
      ];
    },
  },

  mounted() {
    this.handleSearchPageTable();
    this.handleGetLoadSearchInfo();
  },

  methods: {
    // 点击选择检索体检条件回调
    handleSelectConditionDate(val) {
      this.dateName = val.name;
      this.dateCode = val.code;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    handleSearchPageTable() {
      let whereitems = [];
      Object.keys(this.searchForm).forEach((item) => {
        if (this.searchForm[item] && item != "groupcode") {
          whereitems.push({
            key: item,
            value: this.searchForm[item],
          });
        }
      });
      CompanyReportLoad({
        page: 1,
        limit: 100000,
        whereitems,
      }).then((res) => {
        this.tableData = res.data;
      });
    },
    // 打印报告书
    handlePrintReport() {
      this.lodop = getLodop();
      let printname = ``;
      if (this.base64StringArr[0].printname == "") {
        printname = this.lodop.GET_PRINTER_NAME(-1);
      } else {
        printname = this.base64StringArr[0].printname;
      }
      let printObj = new LodopPrinter(null, printname);
      let fileList = this.base64StringArr.map((k) => {
        return k.base64String;
      });
      printObj.printBase64PdfReport(this.lodop, fileList);
    },
    // 打印报告书
    handleGetExportPdf() {
      let code = this.base64String.replace(/[\n\r]/g, "");
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
      a.download = `${this.chooseCompany.companyname}-${this.chooseCompany.batch}`; // 下载文件的名字
      document.body.appendChild(a);
      a.click();
    },
    // 关闭预览弹框
    handleCloseDialog() {
      this.pdfUrl = "";
      this.base64String = "";
      this.base64StringArr = [];
      this.chooseCompany = null;
      this.dialogVisible = false;
    },
    // 查看报表
    handleSeeReport(item) {
      if (!item) {
        this.$message.warning("获取单位信息失败!");
        return;
      }
      this.chooseCompany = item;
      let whereitems = [
        {
          key: "companycode",
          value: item.companycode,
        },
        {
          key: "batch",
          value: item.batch,
        },
      ];
      switch (this.dateCode) {
        case "regdate":
          whereitems.push({
            key: "timetype",
            value: "登记日期",
          });
          whereitems.push({
            key: "startTime",
            value: this.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.endTime,
          });
          break;
        case "inputdate":
          whereitems.push({
            key: "startinputdate",
            value: this.startTime,
          });
          whereitems.push({
            key: "endinputdate",
            value: this.endTime,
          });
          whereitems.push({
            key: "timetype",
            value: "结果时间",
          });
          whereitems.push({
            key: "startTime",
            value: this.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.endTime,
          });
          break;
        case "checkdate":
          whereitems.push({
            key: "starttotalcheckdate",
            value: this.startTime,
          });
          whereitems.push({
            key: "endtotalcheckdate",
            value: this.endTime,
          });
          whereitems.push({
            key: "timetype",
            value: "审核时间",
          });
          whereitems.push({
            key: "startTime",
            value: this.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.endTime,
          });
          break;
        case "checkdatetj":
          whereitems.push({
            key: "startcheckdate",
            value: this.startTime,
          });
          whereitems.push({
            key: "endcheckdate",
            value: this.endTime,
          });
          whereitems.push({
            key: "timetype",
            value: "体检日期",
          });
          whereitems.push({
            key: "startTime",
            value: this.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.endTime,
          });
          break;
        default:
          break;
      }
      printStaticsBase64({
        repname: "团体报告书",
        whereitems,
      }).then((res) => {
        if (res.data != undefined && res.data != null && res.data != "") {
          this.base64ToBlob("", res.data[0].base64String);
          this.base64String = res.data[0].base64String;
          this.base64StringArr = res.data;
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error",
          });
        }
      });
      // this.pdfUrl =
      //   "/pdfjs/web/viewer.html?file=" +
      //   encodeURIComponent(
      //     "http://101.200.229.181:8092/Temp/CompanyReport.pdf"
      //   );
      // this.dialogVisible = true;
    },
    base64ToBlob(name, code) {
      //Base64一行不能超过76字符，超过则添加回车换行符。因此需要把base64字段中的换行符，回车符给去掉，有时候因为存在需要把加号空格之类的换回来，取决于base64存取时的规则。
      code = code.replace(/[\n\r]/g, "");
      var raw = window.atob(code);
      let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
      let uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      let url = window.URL.createObjectURL(
        new Blob([uInt8Array], { type: "application/pdf" })
      );
      this.fileurl = url;
      this.fileexcelurl = url;
      this.printname = name;
      this.pdfUrl = "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
      this.dialogVisible = true;
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
        console.log(selectIndex);
        if (selectIndex > -1) {
          this.searchForm.batch = batchitems[selectIndex].code;
          this.groupitems = batchitems[selectIndex].groupitems;
          this.departitems = batchitems[selectIndex].departitems;
          let group = batchitems[selectIndex].groupitems.filter(
            (k) => k.selected
          )[0];
          group && (this.searchForm.groupcode = group.code);
        }
        this.handleSearchPageTable();
      });
    },
    // 加载搜索条件返回合集回调
    handleGetLoadSearchInfo() {
      getLoadSearchInfo().then((res) => {
        let { meccodeitems, companyitems } = res.result;
        this.meccodeitems = meccodeitems; // 体检中心集合
        this.companyitems = companyitems; // 公司集合
        // 数据回填
        let meccode = meccodeitems.filter((k) => k.selected)[0];
        meccode && (this.searchForm.meccode = meccode.code);
        let company = companyitems.filter((k) => k.selected)[0];
        company && (this.searchForm.company = company.code);
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
      console.log(domId);
      switch (domId) {
        case "btnSearch": // 新增
          this.handleSearchPageTable();
          break;
        case "btnReload": // 新增
          this.$reload();
          break;
        case "btnStatistics": // 统计
          break;
        case "btnPrint": // 打印
          break;
        case "btnDownload": // 导出
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
.company_report {
  .subject {
    .bg {
      .search_box {
        .search_form {
          width: 100% !important;
          display: flex;
          justify-content: start;
          align-items: center;
          .el-form {
            width: 100% !important;
            .data_box_big {
              display: flex;
              .date_box {
                display: flex;
                align-items: center;
                > span {
                  margin: 0 8px;
                }
              }
            }
          }
        }
      }
    }
  }
}
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