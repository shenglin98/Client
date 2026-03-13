<template>
  <div>
    <el-dialog title="预警值追踪" :close-on-click-modal="false" width="850px" @close="handleClose" :visible="show">
      <div class="wrapper">
        <div class="main">
          <el-table
            :data="list"
            stripe
            style="width: 100%"
            height="450px"
            :sort-config="{ trigger: 'cell' }"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
          >
            <el-table-column prop="id" label="序号" width="80px"></el-table-column>
            <el-table-column prop="remark" label="内容"></el-table-column>
            <!-- <el-table-column prop="combinename" label="项目"></el-table-column> -->
            <el-table-column prop="itemname" label="项目"></el-table-column>
            <el-table-column prop="result" label="结果" width="80px"></el-table-column>
            <el-table-column prop="expression" label="参考范围" width="100px"></el-table-column>
            <el-table-column prop="operatordate" label="时间" width="160px"></el-table-column>
            <el-table-column prop="operatorname" label="追踪人" width="100px"></el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTrackJoinCriticalList } from "@/api/customer_critical.js";
export default {
  name: "CustomerCriticalDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    regid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      page: 1,
      limit: 10,
      query: {
        regid: "",
        combinecode: "",
        itemcode: "",
      },
      list: [],
      count: 0,
    };
  },
  computed: {},
  watch: {},
  mounted() {
    if (this.regid) {
      this.query.regid = this.regid;
    }

    this.handleGetList();
  },
  methods: {
    handleGetList() {
      let whereitems = [];
      Object.keys(this.query).forEach((k) => {
        if (this.query[k] != "") {
          whereitems.push({
            key: k,
            value: this.query[k],
          });
        }
      });
      getTrackJoinCriticalList({
        page: this.page,
        limit: this.limit,
        whereitems,
      })
        .then((res) => {
          this.count = res.count;
          this.list = res.data;
        })
        .catch((err) => {
          this.page = 1;
          this.count = 0;
          this.list = [];
        });
    },
    handleClose() {
      this.$emit("update:show", false);
    },
    // 表头样式调整
    handleReturnStyle({ row, rowIndex }) {
      let styleJson = {};
      // styleJson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      styleJson.color = "#000";
      styleJson["font-weight"] = "bold";
      styleJson.background = "#d0ddeb";
      return styleJson;
    },
    // 表格斑马纹颜色调整
    handleTableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "statistics-warning-row";
      } else {
        return "";
      }
    },
    handleSizeChange(val) {
      this.limit = val;
      this.handleGetList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.handleGetList();
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  width: auto;
  padding: 0;
  margin: 0;
}
</style>
