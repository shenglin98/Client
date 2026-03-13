<template>
  <div class="company_settlement">
    <!-- 头部操作控件 -->
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input
          v-model="inputkey"
          size="mini"
          style="width: 200px"
          @keyup.enter.native="handleSearchCompanyList()"
        ></el-input>
        <el-button
          class="filter-item"
          size="mini"
          icon="el-icon-search"
          @click="handleSearchCompanyList()"
          >搜索</el-button
        >
        <permission-btn
          moduleName="sysLogs"
          size="mini"
          v-on:btn-event="onBtnClicked"
        ></permission-btn>
      </div>
    </sticky>

    <el-card class="box-card head_box">
      <div class="content_table">
        <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="loading"
          :border="false"
          :header-cell-style="handleReturnStyle"
          :row-class-name="handleTableRowClassName"
          :cell-style="{ padding: '0' }"
        >
          <el-table-column prop="id" label="序号" width="80"> </el-table-column>
          <el-table-column prop="operateTime" width="180" label="操作时间">
          </el-table-column>
          <el-table-column label="操作标题">
            <template slot-scope="scope">
              <el-link type="primary" @click="handleViewDetails(scope.row)">{{
                scope.row.operateTitle
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="operateType" label="操作类型">
          </el-table-column>
          <!-- <el-table-column prop="operateReqData" label="操作数据" min-width="150">
          </el-table-column> -->
          <el-table-column prop="operateKeyData" label="关键字">
          </el-table-column>
          <el-table-column prop="operateRepData" label="响应数据">
          </el-table-column>
          <el-table-column prop="operateUser" label="操作人"> </el-table-column>
          <el-table-column prop="operateName" label="操作人姓名">
          </el-table-column>
        </el-table>
      </div>
      <div class="foot_page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[50, 100, 200]"
          :page-size="pageSizesList"
          layout="sizes, prev, pager, next, jumper, total"
          :total="totals"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 详情弹框 -->
    <el-dialog title="日志详情" :visible.sync="dialogVisible" width="50%">
      <span v-if="chooseData">{{ chooseData.operateReqData }}</span>
      <span v-else>暂无数据</span>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="(chooseData = undefined), (dialogVisible = false)"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { getCompanyList } from "@/api/operationlog.js";
import { mapGetters } from "vuex";

export default {
  name: "operationlog",
  components: {
    Sticky,
    permissionBtn,
  },

  data() {
    return {
      inputkey: "",
      tableData: [],
      currentPage: 1,
      loading: false,
      totals: null,
      pageSizesList: 50,
      dialogVisible: false, // 查看日志详情
      chooseData: undefined, //查看日志数据
    };
  },
  mounted() {
    // 获取操作日志列表
    this.handleGetCompanyList();
  },
  methods: {
    // 刷新页面数据
    handleRefreshPage() {
      this.currentPage = 1;
      this.pageSizesList = 50;
      this.handleGetCompanyList();
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
    // 查看详情
    handleViewDetails(item) {
      this.chooseData = item;
      this.dialogVisible = true;
    },
    // XX条/页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSizesList = val;
      this.handleGetCompanyList();
    },
    // 页码
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.handleGetCompanyList();
    },
    // 获取操作日志列表
    handleGetCompanyList() {
      this.loading = true;
      let data = {
        page: this.currentPage,
        limit: this.pageSizesList,
        key: this.inputkey,
      };
      getCompanyList(data)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data;
          this.totals = res.count;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 搜索
    handleSearchCompanyList() {
      this.handleGetCompanyList();
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

    onBtnClicked: function (domId) {
      switch (domId) {
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnRefresh": // 关闭当前页面
          this.handleRefreshPage();
          break;
        default:
          break;
      }
    },
  },

  watch: {},

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
};
</script>

<style lang='scss' scoped>
@import "./css/index.scss";
.head_box {
  margin: 10px;
  height: calc(100vh - 140px);

  .el-card__body {
    padding: 0;
  }
  .content_table {
    height: calc(100vh - 205px);
    overflow: auto;
  }
  .foot_page {
    padding: 5px 0;
    display: flex;
    justify-content: center;
  }
}
/deep/.el-dialog__body {
  height: 500px;
  overflow-y: auto;
}
</style>
