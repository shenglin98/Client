<!--我的流程列表-->
<template>
  <div class="flex-column">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" size="mini" prefix-icon="el-icon-search" style="width: 200px;margin-bottom: 0;" class="filter-item" :placeholder="'名称'" v-model="listQuery.key">
        </el-input>
        <permission-btn moduleName='/flowinstances/index' size="mini" v-on:btn-event="onBtnClicked"></permission-btn>

        <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showDescription">描述</el-checkbox>
      </div>
    </sticky>
    <div class="app-container flex-item">

      <el-table height="calc(100% - 52px)" ref="mainTable" :key='tableKey' :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%;" @row-click="rowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>

        <el-table-column :label="'实例编码'" min-width="80px">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'名称'">
          <template slot-scope="scope">
            <span class="link-type" @click="handleDetail(scope.row)">{{scope.row.customName}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="80px" :label="'当前活动节点'">
          <template slot-scope="scope">
            <span class="link-type" @click="handleDetail(scope.row)">{{scope.row.activityName}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="150px" v-if='showDescription' :label="'描述'">
          <template slot-scope="scope">
            <span style='color:red;'>{{scope.row.description}}</span>
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" :label="'状态'" width="100">
          <template slot-scope="scope">
            <span :class="scope.row.isFinish | statusFilter">{{statusOptions.find(u =>u.key == scope.row.isFinish).display_name}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
    </div>
  </div>

</template>

<script>
import * as flowinstances from "@/api/flowinstances";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import { statusOptions } from "@/utils/const.js";
import { mapActions, mapGetters } from "vuex";
import extend from "@/extensions/delRows.js";

export default {
  name: "flowInstances",
  components: {
    Sticky,
    permissionBtn,
    Pagination,
  },
  mixins: [extend],
  directives: {
    waves,
  },
  data() {
    return {
      multipleSelection: [], // 列表checkbox选中的值
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        key: undefined,
      },
      statusOptions: statusOptions,
      showDescription: true,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur",
          },
        ],
      },
      downloadLoading: false,
    };
  },
  filters: {
    statusFilter(isFinish) {
      const statusMap = {
        0: "color-info",
        1: "color-success",
        2: "color-danger",
        3: "color-danger",
        4: "color-danger",
      };
      return statusMap[isFinish];
    },
  },
  computed: {
    ...mapGetters(["isMineRender", "iframeViews", "visitedViews"]),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.isMineRender) {
        vm.getList();
      }
    });
  },
  created() {
    this.getList();
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
    ...mapActions(["updateInstancesIsRender"]),
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onBtnClicked: function (domId) {
      switch (domId) {
        case "btnAdd":
          this.$router.push("/flowinstances/add");
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnEdit":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能选中一个进行编辑",
              type: "error",
            });
            return;
          }
          this.handleUpdate(this.multipleSelection[0]);
          break;
        case "btnDetail":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能选中一个进行查看",
              type: "error",
            });
            return;
          }
          this.handleDetail(this.multipleSelection[0]);
          break;
        case "btnRecall":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能选中一个进行撤销",
              type: "error",
            });
            return;
          }
          this.handleRecall(this.multipleSelection[0]);
          break;
        case "btnStart":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能选中一个进行启动",
              type: "error",
            });
            return;
          }
          this.handleStart(this.multipleSelection[0]);
          break;
        case "btnDel":
          if (this.multipleSelection.length < 1) {
            this.$message({
              showClose: true,
              message: "至少删除一个",
              type: "error",
            });
            return;
          }
          this.handleDelete(this.multipleSelection);
          break;
        default:
          break;
      }
    },
    getList() {
      this.listLoading = true;
      flowinstances.getList(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.count;
        this.listLoading = false;
        this.updateInstancesIsRender({
          type: "isMineRender",
          val: false,
        });
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    handleModifyStatus(row, isFinish) {
      // 模拟修改状态
      this.$message({
        showClose: true,
        message: "操作成功",
        type: "success",
      });
      row.isFinish = isFinish;
    },
    handleDetail(row) {
      // 弹出详情
      this.$router.push("/flowinstances/detail/" + row.id);
    },
    handleUpdate(row) {
      // 弹出编辑框
      this.$router.push("/flowinstances/update/" + row.id);
    },
    handleStart(row) {
      // 启动/运行流程
      flowinstances
        .start({
          flowinstanceId: row.id,
        })
        .then(() => {
          this.$message({
            showClose: true,
            message: "操作成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleRecall(row) {
      // 撤销流程
      flowinstances
        .recall({
          flowinstanceId: row.id,
        })
        .then(() => {
          this.$message({
            showClose: true,
            message: "操作成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleDelete(rows) {
      // 多行删除
      var _this = this;
      _this.delrows(flowinstances, rows, () => {
        _this.updateInstancesIsRender({
          type: "",
          val: true,
        });
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
  },
};
</script>