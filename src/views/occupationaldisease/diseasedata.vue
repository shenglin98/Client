<template>
  <div class="full_search">
    <!-- 主体内容区域 -->
    <div class="subject">
      <el-row style="position: relative;">
        <div style="position: absolute; right:0;" class="print_box">
          <el-button type="primary" plain size="mini" v-for="btn in btnList" :key="btn.flag" @click="hadnleOnBtnClicked(btn.flag)">{{btn.name}}</el-button>
        </div>
      </el-row>
      <el-row class="bg_white" style="margin-top:30px;">
        <!-- 左侧查询条件 -->
        <el-col class="form_box" :span="5">
          <div class="head">
            <div class="logo"></div>
            <div class="head_text">检索条件</div>
          </div>
          <el-form ref="form" :model="searchForm">
            <el-form-item class="checkup_code" size="mini">
              <el-button plain type="primary" style="min-width: 80px" size="mini">体检号</el-button>
              <el-input size="mini" style="margin-right: 5px" clearable ref="checkupWorkInput" @clear="handleSearchPageTable" v-model="searchForm.regid" placeholder="请输入体检号" @keyup.native.enter="handleEnterRegid"></el-input>
            </el-form-item>
            <el-form-item class="checkup_date" size="mini">
              <el-button plain type="primary" size="mini">登记日期</el-button>
              <el-date-picker @change="handleChangeDate" @clear="handleSearchPageTable" size="mini" v-model="searchForm.regdate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">体检类型</div>
              <el-select v-model="searchForm.checktype" clearable @change="handleSearchPageTable">
                <el-option v-for="(item, index) in checktypeitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">检查类型</div>
              <el-select v-model="searchForm.persontype" clearable @change="handleSearchPageTable">
                <el-option label="初检" :value="'0'"></el-option>
                <el-option label="复检" :value="'1'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">姓名</div>
              <el-input v-model="searchForm.name" clearable @clear="handleSearchPageTable" @keyup.native.enter="handleSearchPageTable"></el-input>
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">身份证</div>
              <el-input v-model="searchForm.idcard" clearable @clear="handleSearchPageTable" @keyup.native.enter="handleSearchPageTable"></el-input>
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">HIS标识</div>
              <el-input v-model="searchForm.hisno" clearable @clear="handleSearchPageTable" @keyup.native.enter="handleSearchPageTable"></el-input>
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">电话</div>
              <el-input v-model="searchForm.phone" clearable @clear="handleSearchPageTable" @keyup.native.enter="handleSearchPageTable"></el-input>
            </el-form-item>

            <el-form-item class="select" size="mini">
              <div class="form_label">团检名称</div>
              <el-select v-model="searchForm.checkname" clearable filterable @change="handleChangeCompany">
                <el-option v-for="(item, index) in companyitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">批次</div>
              <el-select v-model="searchForm.batch" clearable @change="handleChangebatch">
                <el-option v-for="(item, index) in batchitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">团检分组</div>
              <el-select v-model="searchForm.group" clearable filterable @change="handleChangeGroup">
                <el-option v-for="(item, index) in groupitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="select" size="mini">
              <div class="form_label">数据上传</div>
              <el-select v-model="searchForm.updata" clearable @change="handleSearchPageTable">
                <el-option label="已上传" :value="'0'"></el-option>
                <el-option label="未上传" :value="'1'"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 右侧表格展示数据 -->
        <el-col class="table_box" :span="19">
          <el-table class="pictureMaterialTableClas" :data="pastMedicalHistoryData" style="width: 100%" :header-cell-style="handleReturnStyle" :border="false" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" :selection-change="handletableSelect" :row-class-name="handleTableRowClassName">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column prop="regdate" label="登记日期">
            </el-table-column>
            <el-table-column prop="regid" label="体检号">
            </el-table-column>
            <el-table-column prop="name" label="姓名">
            </el-table-column>
            <el-table-column prop="sex" label="性别">
            </el-table-column>
            <el-table-column prop="idcard" label="身份证">
            </el-table-column>
            <el-table-column prop="companyname" label="单位名称">
            </el-table-column>
            <el-table-column prop="UpState" label="上传状态">
            </el-table-column>
            <!-- <el-table-column prop="workunit" label="上传时间">
            </el-table-column>
            <el-table-column prop="workunit" label="上传日志">
            </el-table-column> -->
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 1000, 5000, 10000, 50000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

  </div>
</template>
  <script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { printBase64 } from "@/api/printreport.js";
import { jumpRouteLink } from "@/utils/jumpRouteLink.js"; // 跳转页面进入路由缓存
import {
  getLoadSearchInfo,
  getBatch,
  getPageList,
  getExportFile,
  ReportExport,
  DownloadHead,
} from "@/api/fullsearch.js";
// 引入页面接口
import {
  getPersonalOccupationDetail,
  getBatchOrGroup,
} from "@/api/diseasedata.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import { mapGetters } from "vuex";

export default {
  name: "fullsearch",

  components: { Sticky, permissionBtn },

  data() {
    return {
      btnList: [
        { flag: "btnSearch", name: "查询" },
        { flag: "btnUpload", name: "上传" },
        { flag: "btnExport", name: "导出" },
        { flag: "btnShutDown", name: "关闭" },
      ],
      pastMedicalHistoryData: [],
      isSuperpose: false,
      autoPrintReport: false,
      checkDate: [],
      chooseArr: [],
      searchForm: {
        regid: "",
        idcard: "",
        hiscode: "",
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
        reportprintflag: "",
        startcheckdate: "",
        endcheckdate: "",
        checkname: "", // 团检名称
      }, // 检索条件表单
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
      companyitems: [], // 团检名称
      batchitems: [], // 批次集合
      groupitems: [], // 团检分组
      buttons: [],
      domIdArr: [
        "btnGuide",
        "btnPaySingle",
        "btnLabel",
        "btnBarCode",
        "btnReport",
        "btnPhysique",
      ],
      dataSources: "",
      currentPage: 1,
      pageSize: 100,
      count: 0,
      checktypeitems: [],
      meccodes: "", //meccode(院区标识）判断为1，报告书报表调用‘高干报告书’模版
      chooseReport: null,
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  // beforeCreate(){
  //   console.log(sessionStorage.getItem("diseaseInfo"), this.$router);
  //   if (!sessionStorage.getItem("diseaseInfo")) {
  //     console.log("进来了");
  //     this.$router.push({
  //       path: "/occupationaldisease/login",
  //     });
  //   }
  // },
  created() {
   
  },
  mounted() {
    this.handleFocuscheckupWorkInput(); // 获取光标到检索框
    this.getPersonalOccupationDetailFun(); // 获取下拉框数据
  },

  methods: {
    // 获取下拉框数据
    getPersonalOccupationDetailFun() {
      getPersonalOccupationDetail().then((res) => {
        // console.log(res);
        if (res.code == 200) {
          let { checktypeitems, companyitems } = res.result;

          this.checktypeitems = checktypeitems; // 体检类型
          this.companyitems = companyitems; // 团检名称
        }
      });
    },

    // 人员列表选中数据回调
    handletableSelect(row) {
      console.log(row);
    },

    // 获取光标到检索框
    handleFocuscheckupWorkInput() {
      this.$nextTick(() => {
        this.$refs.checkupWorkInput.focus();
      });
    },
    handleEnterRegid() {
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
    // 获取条件计算日期范围回调
    handleGetPrintDate() {
      getSysConfigInfo({ cc: "Sys_FullSearch_DateRange" }).then((res) => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
        this.conditionDate = [this.gettime(start), this.gettime(end)];
        this.checkDate = [this.gettime(start), this.gettime(end)];
        this.searchForm.startcheckdate = this.gettime(start);
        this.searchForm.endcheckdate = this.gettime(end);
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
      console.log(val, "当前改变翻页");
      this.currentPage = val;
      this.handleSearchPageTable();
    },

    // 上传
    handleUpload() {
      console.log("上传");
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
    async handleGetExportPdf() {
      if (this.selectArr.length == 0) return false;
      for (let i = 0; i < this.downloadList.length; i++) {
        await this.handleExportPdf(this.downloadList[i]);
      }
    },
    handleExportPdf(k) {
      return new Promise((resolve, reject) => {
        try {
          let repname = "";
          if (k.meccode == 1) {
            repname = `1、F报告书`;
          } else if (k.meccode == 10003) {
            repname = `1、F水电报告书`;
          } else if (k.meccode == 10004) {
            repname = `1、F国康报告书`;
          }
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [k.regid],
            fileid: k.reportfileid,
            repname,
            designtype: "fast",
            // repname: `1、F报告书`,
            printflag: 1,
            whereitems: [],
          };
          printBase64(data).then((res) => {
            let url = "";
            if (k.reportfileid) {
              url = res.data[0].fileurl;
            } else {
              let code = res.data[0].base64String.replace(/[\n\r]/g, "");
              let raw = window.atob(code);
              let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
              let uInt8Array = new Uint8Array(rawLength);
              for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
              }
              url = window.URL.createObjectURL(
                new Blob([uInt8Array], { type: "application/pdf" })
              );
            }
            const a = document.createElement("a");
            a.href = url;
            a.download = `${k.regid}-${k.name}`; // 下载文件的名字
            // a.download = res.data[0].printname; // 下载文件的名字
            document.body.appendChild(a);
            a.click();
            return resolve("ok");
          });
        } catch (err) {
          return reject(err);
        }
      });
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
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          if (res.data) {
            this.meccodes = res.data[0].meccode;
            this.count = res.count;
            if (this.isEnterRegid && this.isSuperpose && res.data.length == 1) {
              this.pageData.push(...res.data);
            } else {
              this.pageData = res.data;
            }
            if (
              this.isEnterRegid &&
              this.autoPrintReport &&
              res.data.length == 1
            ) {
              this.handlePrintReportAuto(res.data[0]);
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
    // 自动打印报告书
    handlePrintReportAuto(item) {
      this.$refs.popoverRefIdc.forEach(async (d) => {
        if (d.$children[0].$el.innerText == "报告书") {
          let indexP =
            d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
          // this.downloadList.forEach((printItem) => {
          let repname = "";
          if (item.meccode == 1) {
            repname = `${indexP}F报告书`;
          } else if (item.meccode == 10003) {
            repname = `${indexP}F水电报告书`;
          } else if (item.meccode == 10004) {
            repname = `${indexP}F国康报告书`;
          } else {
            repname = d.$children[0].$attrs["data-remark"];
          }
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [item.regid],
            fileid: item.reportfileid,
            repname,
            filetype: "pdf",
            outtype: "url",
            // repname: d.$children[0].$attrs["data-remark"],
            designtype:
              repname.split("、")[1].substr(0, 1) === "F" ? "fast" : "dev",
            printflag: 1,
            whereitems: [],
          };
          printBase64(data).then((res) => {
            this.selectArr.forEach((item) => {
              this.pageData.forEach((k, index) => {
                if (item === k.regid) {
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
            if (item.reportfileid) {
              printObj.printPdfReport(this.lodop, [
                encodeURI(res.data[0].fileurl),
              ]);
            } else {
              let fileList = res.data.map((k) => {
                return k.base64String;
              });
              printObj.printBase64PdfReport(this.lodop, fileList);
            }
          });
        }
      });
    },
    // 团检下拉列表改变值触发回调
    handleChangeCompany(val) {
      // 下拉改变团检选择值回调
      console.log(val);
      if (!val) return false;
      const result = this.companyitems.find((item) => item.code == val);
      this.searchForm.checkname = result.name;
      if (!!result.code) {
        getBatchOrGroup({
          companycode: result.code,
        }).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.batchitems = res.result.batchitems;
            this.searchForm.batch = res.result.batchitems[0]?.code;
            this.groupitems = res.result.batchitems[0]?.groupitems;
            this.searchForm.group =
              res.result.batchitems[0]?.groupitems[0]?.code;
          }
        });
      }
    },
    // 团检分组
    handleChangeGroup(value) {
      console.log(value, "团检分组");
      const result = this.groupitems.find((k) => k.code == value);
      result && (this.searchForm.group = result.name);
      console.log(result, "团检分组");
    },
    // 批次下拉框
    handleChangebatch(val) {
      // console.log(val,'批次下拉框');
      const result = this.batchitems.find((ite) => ite.code == val);
      result && (this.groupitems = result.groupitems);
      console.log(result, "批次下拉框");
    },
    // 点击检索条件筛选全部回调
    handleChangeDate(arr) {
      this.searchForm.startdate = arr[0];
      this.searchForm.enddate = arr[1];
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "btnSearch": // 查询主页列表数据
          this.handleSearchPageTable();
          break;
        case "btnUpload": // 上传
          this.handleUpload();
          break;
        case "btnExport": // 导出
          this.handleGetExportFile();
          break;
        case "btnShutDown": // 关闭当前页面
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