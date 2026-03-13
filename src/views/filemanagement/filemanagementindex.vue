<template>
  <div class="total_check">
    <div class="filter-container">
      <div v-for="(btn, index) of buttons" :key="index">
        <el-button type="primary" plain :size="size" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" class="filter-item" @click="hadnleOnBtnClicked(btn.domId)"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
      </div>
    </div>
    <!-- 主体内容区域 -->
    <div class="subject">
      <el-table :data="fileData" :row-style="rowstyle" element-loading-text="拼命加载中" v-loading="tableLodingFlag" height="630px" :border="false" width="800px" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
        <el-table-column property="id" label="文件id" width="150"></el-table-column>
        <el-table-column property="fileName" label="文件名称" width="200"></el-table-column>
        <el-table-column property="filePath" label="路径" width="200"></el-table-column>
        <el-table-column property="fileType" label="文件类型"></el-table-column>
        <el-table-column property="createTime" label="生成时间"></el-table-column> 
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="Assembly.page" :page-size="Assembly.limit" :page-sizes="[100, 200, 300, 1000, 5000, 10000, 50000]" layout="total, sizes, prev, pager, next, jumper" :total="count">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { Load } from "@/api/filemanagement.js";
import { mapGetters } from "vuex";
export default {
  name: "fileManagement",

  components: {},

  data() {
    return {
      buttons: [], // 按钮组
      size: "mini",
      fileData: [], //文件管理数据
      Assembly: { page: 1, limit: 100 },
      currentPage: 1,
      pageSize: 100,
      count: 0,
      tableLodingFlag: null,
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  mounted() {
    // 获取按钮组数据
    let elements = this.$route.meta.elements;
    this.buttons = elements.sort((a, b) => {
      return a.sort - b.sort;
    });
    this.getFileData(); // 获取首屏数据
  },

  methods: {
    // 当前改变每页条数
    handleSizeChange(val) {
      this.Assembly.limit = val;
      this.getFileData();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.Assembly.page = val;
      this.getFileData();
    },
    // 获取文件数据
    getFileData() {
      this.tableLodingFlag = true;
      Load(this.Assembly).then((res) => {
        this.tableLodingFlag = false;
        this.count = res.count;
        this.fileData = res.data;
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
    // 表格文本变色
    rowstyle({ row, rowIndex }) {
      let stylejson = {};
      if (row.healthstatus == 1) {
        // stylejson.background = "#e0838f"; // 背景颜色
        // 也可以修改文字颜色
        stylejson.color = "red !important";
        return stylejson;
      } else if (row.healthstatus == -1) {
        stylejson.color = "#0000ff !important";
        return stylejson;
      }
      return "";
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
        case "btnRefresh": // 刷新
          this.Assembly.limit = 100;
          this.Assembly.page = 1;
          this.getFileData();
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
@import "./css/filemanagement.scss";
</style>