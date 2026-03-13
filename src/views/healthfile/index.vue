<template>
  <div class="healthrecords">
    <div class="page" v-if="pageStatus === 'subject'">
      <!-- 头部操作控件 -->
      <sticky class="btn_group" :className="'sub-navbar'">
        <div class="filter-container">
          <permission-btn
            ref="permissionBtn"
            moduleName="customerResult"
            size="mini"
            v-on:btn-event="hadnleOnBtnClicked"
          >
          </permission-btn>
        </div>
      </sticky>
      <div class="subject">
        <div class="title">检索条件</div>
        <div class="search_box">
          <el-form ref="form" :model="searchForm" label-width="80px">
            <el-row>
              <el-col :span="4">
                <el-form-item label="体检号" size="mini">
                  <el-input
                    v-model="searchForm.regid"
                    clearable
                    @clear="handleGetPersonalRegisterList"
                    @keyup.native.enter="handleGetPersonalRegisterList"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="姓名" size="mini">
                  <el-input
                    v-model="searchForm.name"
                    clearable
                    @clear="handleGetPersonalRegisterList"
                    @keyup.native.enter="handleGetPersonalRegisterList"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="身份证" size="mini">
                  <el-input
                    v-model="searchForm.idcard"
                    @keyup.native.enter="handleGetPersonalRegisterList"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="联系电话" size="mini">
                  <el-input
                    v-model="searchForm.telephone"
                    clearable
                    @clear="handleGetPersonalRegisterList"
                    @keyup.native.enter="handleGetPersonalRegisterList"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="体检日期" size="mini">
                  <el-date-picker
                    style="width: 100%"
                    size="mini"
                    clearable
                    @change="handleGetPersonalRegisterList"
                    v-model="conditionDate"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="table_box">
          <EasyTable
            row-id="regid"
            :loading="loading"
            class="condition_table_es"
            height="100%"
            :data="pageData"
            :tableOptions="conditionOptions"
            :checkbox-config="{ fetch: true, rowClick: true }"
            @checked-change="handleCheckCondition"
            @row-click="handleRowClick"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :row-style="{ height: '32px' }"
            :cell-style="{ padding: '0' }"
          />
          <el-pagination
            :pager-count="5"
            :small="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 预览弹框 -->
    <el-dialog
      title="预览"
      class="preview_box"
      :visible.sync="showPreview"
      width="650px"
      top="5vh"
      @close="handleCloseDialog"
    >
      <iframe
        ref="pdfCotainer"
        :src="pdfUrl"
        width="100%"
        style="height: calc(100vh - 147px)"
      ></iframe>
    </el-dialog>
    <!-- 详情 -->
    <Details
      v-if="pageStatus === 'details'"
      :userInfo="userInfo"
      @set="setUserInfo"
      @close="pageStatus = 'subject'"
    />
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import Details from "./components/details.vue";
import { mapGetters } from "vuex";
import {
  getSysConfig,
  getPersonalRegisterList,
  getPageList,
} from "@/api/personalregister.js";
import { printBase64 } from "@/api/printreport.js";
export default {
  name: "",

  components: { Sticky, permissionBtn, Details },

  data() {
    return {
      pageStatus: "subject", // 主页 subject 详情 details
      conditionDate: [],
      pageData: [],
      loading: false,
      currentPage: 1, // 当前页
      pageSize: 100, // 页面条数
      count: 0, // 总条数
      dateRange: "",
      userInfo: null,
      searchForm: {
        regid: "",
        name: "",
        idcard: "",
        telephone: "",
        status: "7",
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
      pdfUrl: "",
      showPreview: false,
    };
  },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 检索条件表信息表格配置
    conditionOptions() {
      return [
        {
          title: "姓名",
          width: 100,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleViewDetails(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "性别",
          width: 80,
          prop: "sex",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          width: 80,
          prop: "age",
          returnVal: (value, data) => {
            return `${value}`;
          },
        },
        {
          title: "体检号",
          width: 150,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleViewDetails(data)}
              >
                {data.regid}
              </el-link>
            );
          },
        },
        {
          title: "身份证",
          prop: "idcard",
          width: 150,
          omit: 1,
        },
        {
          title: "报告书",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handlePreviewReport(data)}
              >
                预览
              </el-link>
            );
          },
          width: 100,
          omit: 1,
        },
        {
          title: "体检套餐",
          width: 160,
          omit: 1,
          prop: "setmealname",
        },
        {
          title: "体检费用",
          prop: "discountprice",
          width: 120,
          omit: 1,
        },
        {
          title: "体检类型",
          prop: "checktypename",
          width: 150,
          omit: 1,
        },
        {
          title: "体检单位",
          prop: "companyname",
          width: 150,
          omit: 1,
        },
        {
          title: "体检次数",
          prop: "admiss_times",
          width: 100,
          omit: 1,
        },
        {
          title: "登记时间",
          prop: "regdate",
          // width: 150,
          omit: 1,
        },
        {
          title: "体检时间",
          prop: "checkdate",
          // width: 200,
          omit: 1,
        },
        {
          title: "总检时间",
          prop: "totalcheckinputdate",
          // width: 200,
          omit: 1,
        },
      ];
    },
  },
  mounted() {
    this.handleGetSysConfig();
  },
  methods: {
    // 预览窗口关闭
    handleCloseDialog() {
      this.pdfUrl = "";
      this.showPreview = false;
    },
    handlePreviewReport(item) {
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [item.regid],
        // repname: d.$children[0].$attrs["data-remark"],
        repname: "2、报告书",
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
        if (url) this.showPreview = true;
        this.pdfUrl = "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
      });
    },
    setUserInfo(row, data) {
      this.userInfo = {
        ...this.userInfo,
        ...row,
      };
    },
    // 查看详情
    handleViewDetails(row) {
      getPageList({
        page: 1,
        limit: 200,
        whereitems: [
          {
            key: row.idcard ? "idcard" : "regid",
            value: row.idcard || row.regid,
          },
          { key: "status", value: "7" },
        ],
      })
        .then((res) => {
          console.log(res, row, "详情");
          this.userInfo = {
            ...row,
            res: res,
          };
          this.pageStatus = "details";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取个人登记列表回调
    handleGetPersonalRegisterList() {
      this.loading = true;
      let whereitems = [];
      Object.keys(this.searchForm).forEach((k) => {
        if (this.searchForm[k]) {
          whereitems.push({
            key: k,
            value: this.searchForm[k].trim(),
          });
        }
      });
      // 体检日期
      if (this.conditionDate && this.conditionDate.length > 0) {
        whereitems.push({
          key: "startcheckdate",
          value: this.conditionDate[0],
        });
        whereitems.push({
          key: "endcheckdate",
          value: this.conditionDate[1],
        });
      }

      getPageList({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          this.count = res.count;
          this.pageData = res.data;
          this.loading = false;
        })
        .catch((err) => {
          this.count = 0;
          this.pageData = [];
          this.loading = false;
        });
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
    // 点击选中行
    handleRowClick(row) {
      console.log(row, "123");
    },
    // 检索条件表信息选中行回调
    handleCheckCondition(row) {
      if (!row) return false;
    },
    // 获取系统配置回调
    handleGetSysConfig() {
      getSysConfig({
        page: 1,
        limit: 100000,
      }).then((res) => {
        let dateObj = res.data.filter((k) => k.concode == "Sys_Reg_DefDateRange")[0];
        dateObj && (this.dateRange = dateObj.conitemValue);
        this.handleGetconditionDate();
      });
    },
    // 获取条件计算日期范围回调
    handleGetconditionDate() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * +this.dateRange);
      this.conditionDate = [this.gettime(start), this.gettime(end)];
      this.currentPage = 1;
    },
    // 关闭当前页面回调
    handleClosePage() {
      if (this.visitedViews.length < 1) return false;
      let view = this.visitedViews.filter((k) => k.path === this.$route.path)[0];
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
    hadnleOnBtnClicked(domId) {
      //   console.log(domId);
      switch (domId) {
        case "btnSearch": // 查询
          this.handleGetPersonalRegisterList();
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
<style lang="scss" scoped>
.healthrecords {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  .page {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .btn_group {
      margin-right: 0;
      border-radius: 5px;
    }
    .filter-container {
      display: flex;
      background-color: #f8f8f8;
      height: 42px;
      align-items: center;
      justify-content: flex-end;
      border-radius: 5px;
    }
    .subject {
      width: 100%;
      height: calc(100% - 52px);
      background-color: #f8f8f8;
      // padding: 10px;
      border-radius: 5px;
      margin-top: 10px;
      .title {
        font-size: 18px;
        font-weight: 600;
        color: #343434;
        display: flex;
        align-items: center;
        background-color: #f6f7fc;
        //   margin: -10px 0 0 -10px;
        line-height: 32px;
        padding-left: 12px;
        border-radius: 5px;
      }
      .title::before {
        content: "";
        display: inline-block;
        width: 8px;
        height: 20px;
        background: #559feb;
        border-radius: 4px;
        margin-right: 8px;
      }
      .search_box {
        width: calc(100% - 10px);
        height: 52px;
        margin: 0 5px;
        display: flex;
        align-items: center;
        .el-form-item {
          margin-bottom: 0;
        }
      }
      .table_box {
        width: 100%;
        height: calc(100% - 90px);
        padding: 10px;
        .condition_table_es {
          height: calc(100% - 32px);
          /*滚动条样式*/
          /deep/.el-table__body-wrapper::-webkit-scrollbar {
            width: 8px;
            height: 8px;
            background-color: rgba(240, 240, 240, 1);
          }
          /*定义滚动条轨道 内阴影+圆角*/
          /deep/.el-table__body-wrapper::-webkit-scrollbar-track {
            box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
            border-radius: 10px;
            background-color: rgba(240, 240, 240, 0.5);
          }
          /*定义滑块 内阴影+圆角*/
          /deep/.el-table__body-wrapper::-webkit-scrollbar-thumb {
            border-radius: 10px;
            box-shadow: inset 0 0 0px gray;
            background-color: gray;
          }
        }
        /deep/.el-pagination {
          margin-top: 10px;
          text-align: center;
        }
      }
    }
  }
}
</style>
